#!/usr/bin/env python3
"""Собирает бандл, кладёт его на хост HA и обновляет ресурс дашборда.

Ресурс версионируется хешем содержимого: без этого HA продолжает отдавать
закешированный старый файл, и обновление проходит незаметно для браузера.
"""
import asyncio
import hashlib
import json
import os
import pathlib
import subprocess
import sys

import websockets

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUNDLE = ROOT / "dist" / "ha-plugins-cards.js"
SSH_HOST = os.environ.get("HA_SSH_HOST", "grigorii@192.168.100.200")
REMOTE_WWW = os.environ.get(
    "HA_WWW", "/home/grigorii/.local/state/podman/homeassistant/config/www"
)


async def update_resource(url: str) -> None:
    host = os.environ["HOME_ASSISTANT_URL"].split("://", 1)[-1]
    async with websockets.connect(f"ws://{host}/api/websocket", max_size=None) as ws:
        await ws.recv()
        await ws.send(
            json.dumps({"type": "auth", "access_token": os.environ["HOME_ASSISTANT_KEY"]})
        )
        if json.loads(await ws.recv())["type"] != "auth_ok":
            sys.exit("аутентификация не прошла")

        counter = [0]

        async def call(payload: dict) -> dict:
            counter[0] += 1
            payload["id"] = counter[0]
            await ws.send(json.dumps(payload))
            while True:
                res = json.loads(await ws.recv())
                if res.get("id") == counter[0] and res.get("type") == "result":
                    return res

        items = (await call({"type": "lovelace/resources"}))["result"]
        ours = [r for r in items if BUNDLE.name in r["url"]]
        if ours:
            await call(
                {
                    "type": "lovelace/resources/update",
                    "resource_id": ours[0]["id"],
                    "res_type": "module",
                    "url": url,
                }
            )
            print("ресурс обновлён:", url)
        else:
            await call(
                {"type": "lovelace/resources/create", "res_type": "module", "url": url}
            )
            print("ресурс создан:", url)


def main() -> None:
    subprocess.run(
        ["npm", "--prefix", str(ROOT / "cards"), "run", "build"], check=True
    )

    version = hashlib.sha256(BUNDLE.read_bytes()).hexdigest()[:8]
    print("версия:", version)

    subprocess.run(
        ["scp", "-o", "BatchMode=yes", str(BUNDLE), f"{SSH_HOST}:{REMOTE_WWW}/{BUNDLE.name}"],
        check=True,
    )

    asyncio.run(update_resource(f"/local/{BUNDLE.name}?v={version}"))
    print("готово: обновите вкладку дашборда")


if __name__ == "__main__":
    main()
