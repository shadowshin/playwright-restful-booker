import { test, expect } from '@playwright/test';

test.describe('API /room', () => {
  test('GET /api/room renvoie la liste des chambres', async ({ request }) => {
    const reponse = await request.get('/api/room');

    expect(reponse.status()).toBe(200);

    const corps = await reponse.json();
    expect(Array.isArray(corps.rooms)).toBe(true);
    expect(corps.rooms.length).toBeGreaterThan(0);

    // Contrat minimal : chaque chambre a un identifiant, un nom et un prix positif
    for (const chambre of corps.rooms) {
      expect(chambre).toEqual(
        expect.objectContaining({
          roomid: expect.any(Number),
          roomName: expect.any(String),
          roomPrice: expect.any(Number),
        }),
      );
      expect(chambre.roomPrice).toBeGreaterThan(0);
    }
  });
});
