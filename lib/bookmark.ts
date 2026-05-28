export function getBookmarkShortcutLabel(platform = "") {
  const normalizedPlatform = platform.toLowerCase();

  if (/iphone|ipad|ipod|android/.test(normalizedPlatform)) {
    return "分享菜单";
  }

  if (/mac/.test(normalizedPlatform)) {
    return "⌘D";
  }

  return "Ctrl+D";
}

export function getBookmarkHelpText(platform = "") {
  const shortcut = getBookmarkShortcutLabel(platform);

  if (shortcut === "分享菜单") {
    return "通过浏览器分享菜单将本站加入收藏夹";
  }

  return `按 ${shortcut} 将本站加入浏览器收藏夹`;
}
