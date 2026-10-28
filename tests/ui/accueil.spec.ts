import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe("Page d'accueil", () => {
  test("affiche le nom de l'établissement et les chambres", async ({ page }) => {
    const accueil = new HomePage(page);

    await accueil.ouvrir();

    await expect(accueil.titre).toHaveText('Welcome to Shady Meadows B&B');
    await expect(accueil.sectionChambres).toBeVisible();
    // Le site est partagé : le nombre de chambres peut varier, on vérifie qu'il y en a au moins une
    await expect(accueil.boutonsReserver.first()).toBeVisible();
  });
});
