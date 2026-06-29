describe('CRUD de Avaliações', () => {
  const usuario = {
    email: `testeavaliacao_${Date.now()}@juice-sh.op`,
    password: 'TestE2E@2026!',
    securityAnswer: 'TestAnswer'
  }

  const reviewText = 'Produto excelente, recomendo! - Teste E2E'
  const editReviewText = 'Produto excelente, recomendo! - Teste E2E Editado'

  before(() => {
    cy.visit('/')
    cy.dismissDialogs()
    cy.registrarUsuario(usuario)
  })

  beforeEach(() => {
    cy.login({ email: usuario.email, password: usuario.password })
    cy.dismissDialogs()
  })

  it('Deve gerenciar uma avaliação (Criar e Editar)', () => {
    // === ETAPA 1: CRIAR ===
    cy.visit('/')
    
    // Abre o primeiro produto
    cy.get('.product section[role="button"]').first().click({ force: true })
    cy.wait(1000) // Aguarda a animação do modal principal

    // Escreve nova review
    cy.get('textarea[aria-label="Text field to review a product"]').type(reviewText, { force: true })
    cy.get('#submitButton').click({ force: true })
    cy.wait(1000)

    // Expande accordion de reviews para ver a que foi criada
    cy.get('mat-expansion-panel-header').click({ force: true })
    cy.get('.review-row').should('contain', reviewText)

    // === ETAPA 2: EDITAR ===
    // Clica na própria review recém-criada para abri-la no modal de Edição
    cy.get('.review-row').contains(reviewText).click({ force: true })
    
    // O modal secundário (Edit Review) é aberto. 
    // Usamos o último mat-dialog-container renderizado (o modal que está no topo) para garantir precisão absoluta
    cy.get('mat-dialog-container').last().find('textarea').clear({ force: true }).type(editReviewText, { force: true })
    
    // Clica no Submit do modal secundário
    cy.get('mat-dialog-container').last().find('button[type="submit"]').click({ force: true })
    cy.wait(1000)

    // Verifica se a tabela na janela de fundo foi atualizada
    cy.get('.review-row').should('contain', editReviewText)
    
    // O modal secundário fecha sozinho. Agora fechamos o modal principal de Produto
    // Usamos .first() para evitar erros caso o modal secundário ainda esteja no DOM durante a animação de saída
    cy.get('button[aria-label="Close Dialog"]').first().should('be.visible').click({ force: true })
  })
})
