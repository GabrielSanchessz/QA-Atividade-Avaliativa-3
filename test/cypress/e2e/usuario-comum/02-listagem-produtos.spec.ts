describe('Etapa 1 - Listagem de Produtos', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.dismissDialogs()
  })

  it('Deve listar produtos na página principal', () => {
    cy.get('.product').should('have.length.greaterThan', 0)
  })

  it('Deve permitir a paginação dos produtos', () => {
    // Muda itens por página usando o último mat-select da tela (paginador)
    cy.get('mat-select').last().click({ force: true })
    // Como os tamanhos de página mudam baseados na resolução da tela no JuiceShop novo, clicamos na última opção (maior)
    cy.get('mat-option').last().click({ force: true })
    cy.get('.product').should('have.length.greaterThan', 12)
  })

  it('Deve permitir a busca de um produto', () => {
    // Abre a barra de pesquisa
    cy.get('#searchQuery').click({ force: true })
    // A barra tem uma animação de expansão. Precisamos aguardar para o input não estar mais "coberto"
    cy.wait(500)
    // Digita no input com force: true pois o input nativo fica encoberto pelo CSS do Material
    cy.get('#searchQuery input').type('Apple Juice{enter}', { force: true })
    
    // Verifica se o resultado aparece
    cy.get('.product').contains('Apple Juice').should('be.visible')
  })

  it('Deve exibir detalhes do produto ao clicar no card', () => {
    // Clica exatamente na section (imagem/título) que tem o listener de click
    cy.get('.product section[role="button"]').first().click({ force: true })
    
    // Aguarda o modal aparecer e clica no botão de fechar pelo aria-label universal
    cy.get('button[aria-label="Close Dialog"]').should('be.visible').click({ force: true })
  })
})
