function toggleDropdown(event) {
    if (event) event.stopPropagation();
    const menuTodos = document.querySelector('.menu-todos');
    menuTodos.classList.toggle('ativo');
}

document.addEventListener('click', function(event) {
    const menuTodos = document.querySelector('.menu-todos');
    if (menuTodos && !menuTodos.contains(event.target)) {
        menuTodos.classList.remove('ativo');
    }
});