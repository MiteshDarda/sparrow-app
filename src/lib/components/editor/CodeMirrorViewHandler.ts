import type { Compartment } from "@codemirror/state";
import type { EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { RequestDataType } from "$lib/utils/enums";
import { html } from "@codemirror/lang-html";
import { jsonSetup } from "./code-mirror-themes/BasicCodeMirrorTheme";
import { xml } from "@codemirror/lang-xml";
import { html_beautify, js_beautify } from "js-beautify";

/**
 * @description - remove indentation from the string
 * @param code - text that should be shown on code mirror view
 * @returns - plain text code without indentation
 */
const removeIndentation = (str: string) => {
  // Split the code into lines
  const lines = str.split("\n");
  // Remove leading whitespace from each line
  const unindentedLines = lines.map((line) => line.trim());
  // Join the lines back together
  return unindentedLines.join("\n");
};

/**
 * @description - adds syntax highlighting and formatting to code mirror view
 * @param codeMirrorView - code mirror constructor object
 * @param languageConf - dynamic configuration for code mirror
 * @param lang - language to check syntax and formatting
 * @param isFormatted - insure code is formatted or not
 * @param value - text that should be shown on code mirror view
 * @returns
 */
const CodeMirrorViewHandler = (
  codeMirrorView: EditorView,
  languageConf: Compartment,
  lang: RequestDataType,
  isFormatted: boolean,
  value: string,
) => {
  switch (lang) {
    case RequestDataType.HTML:
      if (codeMirrorView) {
        let payload = {};
        if (isFormatted) {
          payload = {
            changes: {
              from: 0,
              to: codeMirrorView.state.doc.length,
              insert: html_beautify(value),
            },
          };
        }
        codeMirrorView.dispatch({
          effects: languageConf.reconfigure(
            html({
              matchClosingTags: true,
              selfClosingTags: true,
              autoCloseTags: true,
            }),
          ),
          ...payload,
        });
        return;
      }
      break;
    case RequestDataType.JAVASCRIPT:
      if (codeMirrorView) {
        let payload = {};
        if (isFormatted) {
          payload = {
            changes: {
              from: 0,
              to: codeMirrorView.state.doc.length,
              insert: js_beautify(value),
            },
          };
        }
        codeMirrorView.dispatch({
          effects: languageConf.reconfigure(
            javascript({ jsx: true, typescript: true }),
          ),
          ...payload,
        });
      }
      break;
    case RequestDataType.JSON:
      if (codeMirrorView) {
        let payload = {};
        if (isFormatted) {
          payload = {
            changes: {
              from: 0,
              to: codeMirrorView.state.doc.length,
              insert: js_beautify(value),
            },
          };
        }
        codeMirrorView.dispatch({
          effects: languageConf.reconfigure(jsonSetup),
          ...payload,
        });
      }
      break;
    case RequestDataType.XML:
      if (codeMirrorView) {
        let payload = {};
        if (isFormatted) {
          payload = {
            changes: {
              from: 0,
              to: codeMirrorView.state.doc.length,
              insert: html_beautify(value),
            },
          };
        }
        codeMirrorView.dispatch({
          effects: languageConf.reconfigure(xml()),
          ...payload,
        });
      }
      break;
    default:
      if (codeMirrorView) {
        let payload = {};
        if (isFormatted) {
          payload = {
            changes: {
              from: 0,
              to: codeMirrorView.state.doc.length,
              insert: removeIndentation(value),
            },
          };
        }
        codeMirrorView.dispatch({
          effects: languageConf.reconfigure([]),
          ...payload,
        });
      }
      break;
  }
};

export default CodeMirrorViewHandler;
