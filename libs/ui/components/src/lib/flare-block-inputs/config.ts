import { pellConfig } from 'pell';

export const getPellEditorConfig = (
  element: HTMLElement,
  onChange: (html: string) => void
): pellConfig<HTMLElement> => ({
  defaultParagraphSeparator: 'p',
  element,
  onChange,
  styleWithCSS: false,
  actions: ['code'],
  classes: {
    actionbar: 'flare-composer-actionbar',
    button: 'flare-composer-button',
    content: 'flare-composer-content',
    selected: 'flare-composer-selected',
  },
});
