import { type Challenge } from '../../../data/types'

Cypress.Commands.add(
  'expectChallengeSolved',
  (context: { challenge: string }) => {
    cy.request({
      method: 'GET',
      url: '/api/Challenges/?name=' + context.challenge,
      timeout: 60000
    }).then((response) => {
      let challenge: Challenge = response.body.data[0]

      if (!challenge.solved) {
        cy.wait(2000)
        cy.request({
          method: 'GET',
          url: '/api/Challenges/?name=' + context.challenge,
          timeout: 60000
        }).then((secondResponse) => {
          challenge = secondResponse.body.data[0]
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect(challenge.solved).to.be.true
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(challenge.solved).to.be.true
      }
    })
  }
)

Cypress.Commands.add(
  'login',
  (context: { email: string, password: string, totpSecret?: string }) => {
    cy.visit('/#/login')
    if (context.email.match(/\S+@\S+\.\S+/) != null) {
      cy.get('#email').type(context.email)
    } else {
      cy.task<string>('GetFromConfig', 'application.domain').then(
        (appDomain: string) => {
          const email = context.email.concat('@', appDomain)
          cy.get('#email').type(email)
        }
      )
    }
    cy.get('#password').type(context.password)
    cy.get('#loginButton').click()
    cy.wait(500)
  }
)

function walkRecursivelyInArray (arr: number[], cb: any, index = 0) {
  if (arr.length === 0) return
  const ret = cb(index, arr.shift());

  ((ret && ret.chainerId) ? ret : cy.wrap(ret))
    .then((ret: boolean) => {
      if (!ret) return
      walkRecursivelyInArray(arr, cb, index + 1)
    })
}

Cypress.Commands.add('eachSeries', { prevSubject: 'optional' } as any, (arrayGenerated: number[], checkFnToBeRunOnEach: any) => {
  walkRecursivelyInArray(arrayGenerated, checkFnToBeRunOnEach)
})

Cypress.Commands.add('dismissDialogs', () => {
  cy.setCookie('welcomebanner_status', 'dismiss')
  cy.setCookie('cookieconsent_status', 'dismiss')
})

Cypress.Commands.add('registrarUsuario', (usuario) => {
  cy.visit('/#/register')
  
  // Recarrega a página após a navegação. 
  // Isso garante que os cookies definidos no cy.dismissDialogs() sejam lidos na inicialização do Angular,
  // impedindo que o Welcome Banner e o Cookie Consent sequer sejam renderizados no DOM.
  cy.reload()

  // O .clear({force:true}) é a vacina contra as 15 bolinhas (duplicação de texto)
  // O .type(..., {force:true}) e .click({force:true}) cortam qualquer bloqueio visual do Angular Material
  cy.get('#emailControl').clear({ force: true }).type(usuario.email, { force: true })
  cy.get('#passwordControl').clear({ force: true }).type(usuario.password, { force: true })
  cy.get('#repeatPasswordControl').clear({ force: true }).type(usuario.password, { force: true })
  cy.get('mat-select[name="securityQuestion"]').click({ force: true })
  
  // Garante que o Angular renderizou as opções antes de clicar
  cy.get('mat-option').should('have.length.greaterThan', 0)
  cy.get('mat-option').first().click({ force: true })
  
  cy.get('#securityAnswerControl').clear({ force: true }).type(usuario.securityAnswer, { force: true })
  cy.get('#registerButton').click({ force: true })
  
  // Aguarda a confirmação de que o cadastro no backend terminou com sucesso
  // antes de prosseguir, evitando erro 401 no login por falta de sincronismo.
  cy.contains('Registration completed successfully').should('be.visible')
})
