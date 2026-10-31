import { test, expect } from '@playwright/test';

test.describe('API/auth/login', () => {
  test('POST /api/auth/login renvoie un token avec des identifiants valides', async ({ request }) => {
    const reponse = await request.post('/api/auth/login', {
      data: { username: 'admin', password: 'password' },
    });

    expect(reponse.status()).toBe(200);

    const auth = await reponse.json();
    expect(auth.token).toEqual(expect.any(String));
    expect(auth.token.length).toBeGreaterThan(0);
  });
  
  test('POST /api/auth/login refuse un mauvais mot de passe, statut 401', async ({ request }) => {
    const reponse = await request.post('/api/auth/login', {
      data: { username: 'admin', password: 'wrongpassword' },
    });

    expect(reponse.status()).toBe(401);
    const auth = await reponse.json();
    expect(auth.error).toBe('Invalid credentials');
    expect(auth.token).toBeUndefined();
  });
});
