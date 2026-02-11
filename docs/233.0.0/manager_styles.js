const rootObserver = new MutationObserver((mutations, observer) => {
    // Wait until the explorer tree is available
    const el = document.querySelector("#storybook-explorer-tree");
    if (!el) return;

    // Find all groups and adjust padding of their children
    const groups = Array.from(document.querySelectorAll('[data-nodetype=group]').values());
    groups.forEach(group => {
        Array.from(document.querySelectorAll(`[data-parent-id="${group.id}"]`).values()).forEach(child => {
            child.style.paddingInlineStart = `calc(${getComputedStyle(group).paddingInlineStart} + 16px)`;
        });
    });

    // Find all root elements that are expanded but have no groups and hide their expand button
    const rootEls = document.querySelectorAll('[data-nodetype=root]:has(button[aria-expanded="true"])');
    rootEls.forEach(rootEl => {
        const hasGroups = document.querySelectorAll(`[data-parent-id="${rootEl.id}"][data-nodetype=group]`).length > 0;
        if (hasGroups) return;
        const expandBtn = document.querySelector(`#${rootEl.id} button.sidebar-subheading-action`);
        if (!expandBtn) return;
        expandBtn.style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", () => {
    rootObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
});