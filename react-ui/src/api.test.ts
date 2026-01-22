import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";
import type { User, UserCreate, UserUpdate } from "./types";

describe("api", () => {
  const baseUrl = "http://localhost:8080";

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const mockFetchResolved = (payload: {
    ok: boolean;
    status: number;
    statusText?: string;
    json?: unknown;
    text?: string;
  }) => {
    const response = {
      ok: payload.ok,
      status: payload.status,
      statusText: payload.statusText ?? "",
      json: vi.fn().mockResolvedValue(payload.json ?? {}),
      text: vi.fn().mockResolvedValue(payload.text ?? "")
    } as Response;

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(response);
  };

  it("lists users", async () => {
    const users: User[] = [
      { id: 1, name: "Jane", email: "jane@example.com", age: 30 }
    ];
    mockFetchResolved({ ok: true, status: 200, json: users });

    await expect(api.listUsers()).resolves.toEqual(users);
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/api/users`,
      expect.objectContaining({
        headers: { "Content-Type": "application/json" }
      })
    );
  });

  it("creates a user", async () => {
    const payload: UserCreate = { name: "Nina", email: "nina@example.com", age: 22 };
    const created: User = { id: 10, ...payload };
    mockFetchResolved({ ok: true, status: 200, json: created });

    await expect(api.createUser(payload)).resolves.toEqual(created);
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/api/users`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload)
      })
    );
  });

  it("updates a user", async () => {
    const payload: UserUpdate = { name: "Mia", email: "mia@example.com", age: 29 };
    const updated: User = { id: 12, ...payload };
    mockFetchResolved({ ok: true, status: 200, json: updated });

    await expect(api.updateUser(12, payload)).resolves.toEqual(updated);
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/api/users/12`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(payload)
      })
    );
  });

  it("deletes a user", async () => {
    mockFetchResolved({ ok: true, status: 204 });

    await expect(api.deleteUser(3)).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/api/users/3`,
      expect.objectContaining({
        method: "DELETE"
      })
    );
  });

  it("throws on error responses", async () => {
    mockFetchResolved({
      ok: false,
      status: 500,
      statusText: "Server Error",
      text: "Boom"
    });

    await expect(api.listUsers()).rejects.toThrow("Boom");
  });
});
