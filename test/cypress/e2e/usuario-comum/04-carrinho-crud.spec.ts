describe('Etapas 1, 2 e 3 - CRUD do Carrinho de Compras', () => {
  const usuario = {
    email: `testecarrinho_${Date.now()}@juice-sh.op`,
    password: 'TestE2E@2026!',
    securityAnswer: 'TestAnswer'
  }

  before(() => {
    cy.visit('/')
    cy.dismissDialogs()
    cy.registrarUsuario(usuario)
  })

  beforeEach(() => {
    cy.login({ email: usuario.email, password: usuario.password })
    cy.dismissDialogs()
  })

  it('Deve gerenciar o carrinho (Adicionar, Alterar Qtd e Remover)', () => {
    // === ETAPA 1: ADICIONAR ===
    cy.visit('/')
    // Adiciona o primeiro produto (Apple Juice)
    cy.get('.product button[aria-label="Add to Basket"]').first().click({ force: true })
    cy.contains('Placed').should('be.visible')

    // Verifica no carrinho
    cy.visit('/#/basket')
    cy.get('mat-table').should('contain', 'Apple Juice')
    cy.get('mat-row').should('have.length.greaterThan', 0)

    // === ETAPA 2: ALTERAR QUANTIDADE ===
    // Aumenta quantidade
    cy.get('mat-row').first().find('button').find('.fa-plus-square').click({ force: true })
    cy.wait(500) // Aguarda a requisição
    cy.get('mat-row').first().find('span.cell-initial-font').should('contain', '2')

    // Diminui quantidade
    cy.get('mat-row').first().find('button').find('.fa-minus-square').click({ force: true })
    cy.wait(500)
    cy.get('mat-row').first().find('span.cell-initial-font').should('contain', '1')

    // === ETAPA 3: REMOVER ITEM ===
    cy.get('mat-row').first().find('button').find('.fa-trash-alt').click({ force: true })
    cy.get('app-purchase-basket').should('not.contain', 'Apple Juice')
  })
})
