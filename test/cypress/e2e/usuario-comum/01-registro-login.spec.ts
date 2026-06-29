describe('Etapa 1 - Registro e Login', () => {
  const usuario = {
    email: `testee2e_${Date.now()}@juice-sh.op`,
    password: 'TestE2E@2026!',
    securityAnswer: 'TestAnswer'
  }

  it('Deve registrar um novo usuário com sucesso', () => {
    cy.visit('/')
    cy.dismissDialogs()
    cy.registrarUsuario(usuario)
    cy.contains('Registration completed successfully').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('Deve fazer login com o usuário criado e mostrar o email no menu', () => {
    cy.visit('/#/login')
    cy.get('#email').type(usuario.email)
    cy.get('#password').type(usuario.password)
    cy.get('#loginButton').click()
    
    // Verifica que logou
    cy.get('#navbarAccount').click()
    cy.get('button[aria-label="Go to user profile"]').should('contain', usuario.email)
    
    // Logout para resetar o estado
    cy.get('#navbarLogoutButton').click()
    cy.url().should('include', '/')
  })
})
