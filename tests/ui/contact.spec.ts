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
});