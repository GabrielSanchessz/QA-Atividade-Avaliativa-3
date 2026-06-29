describe('Etapas 1, 2 e 3 - CRUD de Endereços', () => {
  const usuario = {
    email: `testeendereco_${Date.now()}@juice-sh.op`,
    password: 'TestE2E@2026!',
    securityAnswer: 'TestAnswer'
  }

  const endereco = {
    country: 'Brazil',
    fullName: 'Teste E2E',
    mobileNum: 1199988776, // Limite de 10 dígitos (1000000-9999999999)
    zipCode: '01001000',
    streetAddress: 'Rua Teste 123',
    city: 'São Paulo',
    state: 'SP'
  }

  before(() => {
    cy.visit('/')
    cy.dismissDialogs()
    cy.registrarUsuario(usuario)
  })

  beforeEach(() => {
    cy.login({ email: usuario.email, password: usuario.password })
    cy.dismissDialogs() // Prevent dialog overlay issues
  })

  // Unimos todas as etapas num único teste E2E porque o Cypress limpa a sessão entre blocos 'it' 
  // e reavalia o Date.now() se o usuário executar os testes de forma isolada na interface.
  it('Deve criar, editar e excluir um endereço (Fluxo Completo)', () => {
    // === ETAPA 1: CRIAR ===
    cy.visit('/#/address/saved')
    cy.get('.btn-new-address').click({ force: true })

    cy.get('input[placeholder="Please provide a country."]').type(endereco.country, { force: true })
    cy.get('input[placeholder="Please provide a name."]').type(endereco.fullName, { force: true })
    cy.get('input[placeholder="Please provide a mobile number."]').type(endereco.mobileNum.toString(), { force: true })
    cy.get('input[placeholder="Please provide a ZIP code."]').type(endereco.zipCode, { force: true })
    cy.get('#address').type(endereco.streetAddress, { force: true })
    cy.get('input[placeholder="Please provide a city."]').type(endereco.city, { force: true })
    cy.get('input[placeholder="Please provide a state."]').type(endereco.state, { force: true })

    cy.get('#submitButton').click({ force: true })

    cy.contains(`The address at ${endereco.city} has been successfully added to your addresses.`).should('be.visible')
    cy.get('.address-table').should('contain', endereco.fullName)
    cy.get('.address-table').should('contain', endereco.streetAddress)

    // === ETAPA 2: EDITAR ===
    // O Angular remove o atributo routerLink do DOM final, então buscamos pelo ícone fa-edit
    cy.get('.address-table').contains(endereco.fullName).parents('mat-row').find('button').find('.fa-edit').click({ force: true })

    const newStreet = 'Rua Teste Atualizada 456'
    cy.get('#address').clear({ force: true }).type(newStreet, { force: true })
    cy.get('#submitButton').click({ force: true })

    cy.contains(`The address at ${endereco.city} has been successfully updated.`).should('be.visible')
    cy.get('.address-table').should('contain', newStreet)

    // === ETAPA 3: EXCLUIR ===
    cy.get('.address-table').contains(endereco.fullName).parents('mat-row').find('button').find('.fa-trash-alt').click({ force: true })

    cy.contains('Your address has been removed.').should('be.visible')
    cy.get('app-saved-address').should('not.contain', endereco.fullName)
  })
})
