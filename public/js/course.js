document.querySelectorAll('.collapse-label').forEach(collapseLabel => {
    collapseLabel.onclick = () => {
        if (collapseLabel.classList.contains('open')) {
            collapseLabel.classList.remove('open');
            document.getElementById(collapseLabel.dataset.for).classList.remove('open');
        } else {
            collapseLabel.classList.add('open');
            document.getElementById(collapseLabel.dataset.for).classList.add('open');
        }
    }
})

document.getElementById('search').addEventListener('input', function () {
    var keyWord = this.value;
    document.querySelectorAll('.block').forEach(block => {
        if (block.innerText.includes(keyWord)) block.style.display = 'block';
        else block.style.display = 'none';
    })
})