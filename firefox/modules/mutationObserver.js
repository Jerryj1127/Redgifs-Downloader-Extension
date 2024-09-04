// mutationObserver.js

export function observeDOM(addButtons) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains('GifPreview-SideBarWrap')) {
            addButtons(node);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // document.querySelectorAll('.GifPreview-SideBarWrap').forEach(addButtons);
}
