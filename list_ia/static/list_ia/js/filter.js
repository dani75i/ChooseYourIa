document.addEventListener("DOMContentLoaded", function() {
    // Sélectionner tous les éléments de type checkbox avec la classe 'form-check-input'
    const switches = document.querySelectorAll(".form-check-input");

all_switches_check = []
        

    switches.forEach(checkbox => {
        checkbox.addEventListener('change', event => {
            all_switches_check = []
            for (let i = 0; i < switches.length; i++) {
                if (switches[i].checked) {
                    all_switches_check.push(switches[i].id);
                }
                
            }
            
          filter(all_switches_check)
          console.log(all_switches_check);
        });

    });


});


function filter(filter_name, page = 1) { // Ajout de "page" comme paramètre par défaut
    let results = document.getElementById("results");
    let pagination = document.getElementById("pagination");
    let loader = document.getElementById("loading-spinner");
    let numberTotal = document.getElementById("number-result");

    // Afficher le spinner
    loader.style.display = "block";
    results.innerHTML = ""; // Vider les résultats existants
    pagination.innerHTML = ""; // Vider les résultats existants
    numberTotal.innerHTML = ""; // Vider les résultats existants
    
    $.ajax({
        url: "filter",  
        type: "GET", 
        data: {
            'filter': filter_name,
            'page': page  // Ajouter le numéro de page aux paramètres
        },
        success: function(response) {
            loader.style.display = "none";

            // Ajouter les résultats
            response["results"].forEach(function(item) {
                let newDiv = document.createElement("div"); 

                newDiv.innerHTML = `
                    <a href="${item.url}" target="_blank" class="text-decoration-none">
                        <div class="card mb-3 card-result">
                            <div class="row g-0 d-flex align-items-center">
                                <!-- Image -->
                                <div class="col-md-3 col-4 d-flex justify-content-center">
                                    <img src="${item.image}" class="img-fluid rounded-start fixed-size-img" alt="${item.title}">
                                </div>
                                <!-- Texte -->
                                <div class="col-md-9 col-8">
                                    <div class="card-body card-body-result">
                                        <h5 class="card-title">${item.title}</h5>
                                        <p class="card-text">${item.text}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Footer -->
                            <div class="card-footer card-footer-result w-100 d-flex justify-content-between align-items-center">
                                <!-- Tags alignés à gauche -->
                                <div class="tags-section">
                                    ${Array.isArray(item.tags) ? item.tags.map(tag => `<span class="badge rounded-pill">${tag}</span>`).join(' ') : ''}
                                </div>
                                <!-- Étoiles alignées à droite -->
                                <div class="rating-section">
                                    ${[...Array(item.rating)].map(() => `
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white svg-star" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/>
                                        </svg>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </a>
                `;
                newDiv.classList.add("col-md-6", "col-sm-12"); 
                results.appendChild(newDiv);
            });

            // Mettre à jour la pagination
            const paginationData = response.pagination || {};
            const pages = Array.isArray(paginationData.pages) ? paginationData.pages : [];
            pagination.innerHTML = `
                <nav aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-center">
                        ${paginationData.has_previous ? `
                            <li class="page-item">
                                <a class="page-link" href="#" data-page="${paginationData.current_page - 1}" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                        ` : `
                            <li class="page-item disabled">
                                <span class="page-link" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </span>
                            </li>
                        `}
                        ${pages.map(page_num => `
                            <li class="page-item ${page_num === paginationData.current_page ? 'active' : ''}">
                                <a class="page-link" href="#" data-page="${page_num}">${page_num}</a>
                            </li>
                        `).join('')}
                        ${paginationData.has_next ? `
                            <li class="page-item">
                                <a class="page-link" href="#" data-page="${paginationData.current_page + 1}" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        ` : `
                            <li class="page-item disabled">
                                <span class="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </span>
                            </li>
                        `}
                    </ul>
                </nav>
            `;

            // Ajouter des événements de clic aux liens de pagination
            document.querySelectorAll('#pagination .page-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = parseInt(this.getAttribute('data-page'));
                    filter(filter_name, page); // Recharger avec la nouvelle page
                });
            });
            numberTotal.innerHTML = paginationData.total_items 
        },
        error: function(xhr, errmsg, err) {
            // En cas d'erreur
            $('#result').html('<p>Error: ' + errmsg + '</p>');
        }
    });
}


