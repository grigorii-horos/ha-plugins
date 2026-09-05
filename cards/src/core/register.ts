import type { CustomCardEntry } from "./types";

/**
 * Регистрация карточек и редакторов, переживающая вторую загрузку бандла.
 *
 * `customElements.define` на уже занятое имя бросает исключение, и модуль
 * умирает целиком. Случается это буднично: dev-ресурс остался в дашборде, а
 * рядом появился установленный через HACS. Работать будет тот, что загрузился
 * первым, — то есть можно смотреть на старый код, думая, что обновился.
 *
 * Поэтому вторая копия молча уступает первой и говорит об этом в консоль.
 */

let warned = false;

function alreadyLoaded(tag: string): void {
  if (warned) return;
  warned = true;
  // eslint-disable-next-line no-console
  console.warn(
    `horos-cards: карточка ${tag} уже зарегистрирована. Похоже, бандл ` +
      `подключён к дашборду дважды — работает копия, загруженная первой. ` +
      `Проверьте ресурсы дашборда.`
  );
}

export function registerCard(
  tag: string,
  ctor: CustomElementConstructor,
  entry: CustomCardEntry
): void {
  if (customElements.get(tag)) {
    alreadyLoaded(tag);
    return;
  }
  customElements.define(tag, ctor);
  window.customCards = window.customCards ?? [];
  window.customCards.push(entry);
}

export function registerEditor(
  tag: string,
  ctor: CustomElementConstructor
): void {
  if (customElements.get(tag)) return;
  customElements.define(tag, ctor);
}
