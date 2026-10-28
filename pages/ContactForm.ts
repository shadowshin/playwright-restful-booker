import { type Locator, type Page } from '@playwright/test';

export class ContactForm {
  readonly page: Page;
  readonly champNom: Locator;
  readonly champEmail: Locator;
  readonly champTelephone: Locator;
  readonly champSujet: Locator;
  readonly champMessage: Locator;
  readonly boutonSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.champNom = page.getByLabel('Name');
    this.champEmail = page.getByLabel('Email');
    this.champTelephone = page.getByLabel('Phone');
    this.champSujet = page.getByLabel('Subject');
    // Contournement BUG-001 : le label "Message" pointe vers id="message" alors que le champ a id="description",
    // donc getByLabel ne trouve pas le champ. À repasser en getByLabel quand le défaut sera corrigé.
    this.champMessage = page.getByTestId('ContactDescription');
    this.boutonSubmit = page.getByRole('button', { name: 'Submit' });
  }

  async remplir(nom: string, email: string, telephone: string, sujet: string, message: string) {
    await this.champNom.fill(nom);
    await this.champEmail.fill(email);
    await this.champTelephone.fill(telephone);
    await this.champSujet.fill(sujet);
    await this.champMessage.fill(message);
  }

  async envoyer() {
    await this.boutonSubmit.click();
  }
}