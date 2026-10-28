import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object de la page d'accueil.
 * Il regroupe les locators et les actions de la page, pour que les tests
 * restent lisibles et qu'un changement d'interface ne se corrige qu'ici.
 */
export class HomePage {
  readonly page: Page;
  readonly titre: Locator;
  readonly sectionChambres: Locator;
  readonly boutonsReserver: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titre = page.getByRole('heading', { level: 1 });
    this.sectionChambres = page.getByRole('heading', { name: 'Our Rooms' });
    this.boutonsReserver = page.getByRole('link', { name: 'Book now' });
  }

  async ouvrir() {
    await this.page.goto('/');
    // la page affiche un indicateur de chargement tant que React n'a pas récupéré ses données
    await expect(this.titre).toBeVisible();
  }
}
