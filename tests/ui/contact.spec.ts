import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ContactForm } from '../../pages/ContactForm';

test.describe('Formulaire de contact', () => {
  test('envoie un message valide et affiche la confirmation', async ({ page }) => {
    const nom = 'John Doe';
    const email = 'johndoe@mail.com';
    const telephone = '012345678974';
    const sujet = 'Demande de renseignements';
    const message = 'Bonjour, je souhaite obtenir plus d\'informations sur vos chambres.';
    const accueil = new HomePage(page);

    await accueil.ouvrir();

    const contactForm = new ContactForm(page);

    await contactForm.remplir(nom, email, telephone, sujet, message);
    // On commence à écouter AVANT de cliquer, sinon on risque de rater la réponse
    const reponseEnvoi = page.waitForResponse(
      (reponse) => reponse.url().includes('/api/message') && reponse.request().method() === 'POST',
    );
    await contactForm.envoyer();
    // Le serveur de démo met jusqu'à 15 s à traiter le message (constaté dans les traces) :
    // on attend sa réponse, puis on vérifie qu'il a accepté le message
    expect((await reponseEnvoi).ok()).toBe(true);
    await expect(page.getByRole('heading', { name: `Thanks for getting in touch ${nom}!` })).toBeVisible();
    await expect(page.getByText(sujet)).toBeVisible();
  });
  test('refuse un formulaire vide et affiche les erreurs', async ({ page }) => {
    const accueil = new HomePage(page);

    await accueil.ouvrir();

    const contactForm = new ContactForm(page);

    // On commence à écouter AVANT de cliquer, sinon on risque de rater la réponse
    const reponseEnvoi = page.waitForResponse(
      (reponse) => reponse.url().includes('/api/message') && reponse.request().method() === 'POST',
    );
    await contactForm.envoyer();
    // Le serveur de démo met jusqu'à 15 s à traiter le message (constaté dans les traces) :
    // on attend sa réponse, puis on vérifie qu'il affiche l'erreur
    expect((await reponseEnvoi).status()).toBe(400);
    const erreursAttendues = [
      'Name may not be blank',
      'Email may not be blank',
      'Phone may not be blank',
      'Phone must be between 11 and 21 characters',
      'Subject may not be blank',
      'Subject must be between 5 and 100 characters',
      'Message may not be blank',
      'Message must be between 20 and 2000 characters'
    ];
    for (const erreur of erreursAttendues) {
      await expect(contactForm.alerte).toContainText(erreur);
    }
  });
  test('refuse un email invalide et affiche l\'erreur', async ({ page }) => {
    const nom = 'john doe';
    const email = 'invalid-email';
    const telephone = '012345678974';
    const sujet = 'Demande de renseignements';
    const message = 'Bonjour, je souhaite obtenir plus d\'informations sur vos chambres.';
    const accueil = new HomePage(page);

    await accueil.ouvrir();

    const contactForm = new ContactForm(page);

    await contactForm.remplir(nom, email, telephone, sujet, message);
    // On commence à écouter AVANT de cliquer, sinon on risque de rater la réponse
    const reponseEnvoi = page.waitForResponse(
      (reponse) => reponse.url().includes('/api/message') && reponse.request().method() === 'POST',
    );
    await contactForm.envoyer();
    // Le serveur de démo met jusqu'à 15 s à traiter le message (constaté dans les traces) :
    // on attend sa réponse, puis on vérifie qu'il affiche l'erreur
    expect((await reponseEnvoi).status()).toBe(400);
    await expect(contactForm.alerte).toContainText('must be a well-formed email address');
  });
});