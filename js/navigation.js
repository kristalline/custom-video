const navigation = (data) => {
    const ul = document.createElement('ul');
    ul.classList.add('list');

    const els = data.map((item) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.setAttribute('data-id', item.id);
        link.classList.add('list-link');
        const img = document.createElement('img');
        img.classList.add('list-img');
        img.setAttribute('src', item.poster);
        link.append(img);
        li.append(link);
        const title = document.createElement('h3');
        title.textContent = item.name;
        li.append(title);
        return li;
    });
    if (els.length > 0) {
        ul.append(...els);
        return ul
    }    
    return null;
};

export default navigation;