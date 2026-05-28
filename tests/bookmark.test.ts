import test from "node:test";
import assert from "node:assert/strict";

import {
  getBookmarkHelpText,
  getBookmarkShortcutLabel
} from "../lib/bookmark";

test("getBookmarkShortcutLabel uses Command+D on Apple platforms", () => {
  assert.equal(getBookmarkShortcutLabel("MacIntel"), "⌘D");
  assert.equal(getBookmarkShortcutLabel("iPhone"), "分享菜单");
});

test("getBookmarkHelpText explains browser bookmarking without navigation", () => {
  assert.equal(
    getBookmarkHelpText("Win32"),
    "按 Ctrl+D 将本站加入浏览器收藏夹"
  );
});
