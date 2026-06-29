describe('Etapa Extra - Fluxo Completo de Compra', () => {
  const usuario = {
    email: `testecompra_${Date.now()}@juice-sh.op`,
    password: 'TestE2E@2026!',
    securityAnswer: 'TestAnswer'
  }

  const endereco = {
    country: 'Brazil',
    fullName: 'Teste E2E Compra',
    mobileNum: 1199988776, // Limite de 10 dígitos
    zipCode: '01001000',
    streetAddress: 'Rua Teste Compra 123',
    city: 'São Paulo',
    state: 'SP'
  }

  const cartao = {
    fullName: 'Teste E2E Compra',
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

  it('Deve realizar uma compra completa com sucesso', () => {
    // 1. Adicionar produto
    cy.visit('/')
    cy.get('.product button[aria-label="Add to Basket"]').first().click({ force: true })
    
    // 2. Checkout no carrinho
    cy.visit('/#/basket')
    cy.get('#checkoutButton').click({ force: true })

    // 3. Adicionar endereço (se não tiver, precisamos criar)
    cy.url().should('include', '/address/select')
    cy.get('.btn-new-address').click({ force: true })
    cy.get('input[placeholder="Please provide a country."]').type(endereco.country, { force: true })
    cy.get('input[placeholder="Please provide a name."]').type(endereco.fullName, { force: true })
    cy.get('input[placeholder="Please provide a mobile number."]').type(endereco.mobileNum.toString(), { force: true })
    cy.get('input[placeholder="Please provide a ZIP code."]').type(endereco.zipCode, { force: true })
    cy.get('#address').type(endereco.streetAddress, { force: true })
    cy.get('input[placeholder="Please provide a city."]').type(endereco.city, { force: true })
    cy.get('input[placeholder="Please provide a state."]').type(endereco.state, { force: true })
    cy.get('#submitButton').click({ force: true })

    // 4. Selecionar endereço
    cy.get('mat-row').first().find('mat-radio-button').click({ force: true })
    cy.get('button[aria-label="Proceed to payment selection"]').click({ force: true })

    // 5. Método de entrega
    cy.get('mat-row').first().find('mat-radio-button').click({ force: true })
    cy.get('button[aria-label="Proceed to delivery method selection"]').click({ force: true })

    // 6. Adicionar cartão
    cy.get('mat-expansion-panel-header').first().click({ force: true })
    cy.get('mat-expansion-panel').first().find('input[type="text"]').type(cartao.fullName, { force: true })
    cy.get('mat-expansion-panel').first().find('input[type="number"]').type(cartao.cardNum.toString(), { force: true })
    cy.get('select').eq(0).select(cartao.expMonth.toString())
    cy.get('select').eq(1).select(cartao.expYear.toString())
    cy.get('#submitButton').click({ force: true })

    // 7. Selecionar cartão e finalizar
    cy.get('mat-row').first().find('mat-radio-button').click({ force: true })
    cy.get('button[aria-label="Proceed to review"]').click({ force: true })
    cy.get('#checkoutButton').click({ force: true })

    // 8. Confirmação
    cy.url().should('include', '/order-completion')
    cy.get('.confirmation').should('be.visible')
  })
})
