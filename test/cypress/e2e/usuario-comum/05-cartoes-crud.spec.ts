describe('Etapas 1 e 3 - CRUD de Cartões de Pagamento', () => {
  const usuario = {
    email: `testecartao_${Date.now()}@juice-sh.op`,
    password: 'TestE2E@2026!',
    securityAnswer: 'TestAnswer'
  }

  const cartao = {
    fullName: 'Teste E2E Cartao',
    cardNum: 4111111111111111,
    expMonth: 12,
    expYear: 2090
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

  it('Deve gerenciar cartões de pagamento (Adicionar e Remover)', () => {
    // === ETAPA 1: ADICIONAR ===
    cy.visit('/#/saved-payment-methods')
    
    // Expande o form
    cy.get('mat-expansion-panel-header').click({ force: true })

    // Preenche form (restringindo a busca para dentro do painel para não conflitar com a navbar)
    cy.get('mat-expansion-panel').first().find('input[type="text"]').type(cartao.fullName, { force: true })
    cy.get('mat-expansion-panel').first().find('input[type="number"]').type(cartao.cardNum.toString(), { force: true })
    cy.get('select').eq(0).select(cartao.expMonth.toString())
    cy.get('select').eq(1).select(cartao.expYear.toString())
    
    cy.get('#submitButton').click({ force: true })

    cy.contains('Your card ending with 1111 has been saved').should('be.visible')
    cy.get('mat-table').should('contain', '1111')
    cy.get('mat-table').should('contain', cartao.fullName)

    // === ETAPA 3: EXCLUIR ===
    // Deleta o cartão criado (reaproveitando a página já carregada)
    cy.get('mat-row').contains(cartao.fullName).parents('mat-row').find('button').find('.fa-trash-alt').click({ force: true })

    cy.get('app-saved-payment-methods').should('not.contain', cartao.fullName)
  })
})
