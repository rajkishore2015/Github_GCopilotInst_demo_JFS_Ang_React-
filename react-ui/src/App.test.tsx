import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { api } from "./api";

vi.mock("./api", () => ({
  api: {
    listUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn()
  }
}));

const mockedApi = api as unknown as {
  listUsers: ReturnType<typeof vi.fn>;
  createUser: ReturnType<typeof vi.fn>;
  updateUser: ReturnType<typeof vi.fn>;
  deleteUser: ReturnType<typeof vi.fn>;
};

const createDeferred = <T,>() => {
  let resolve: (value: T) => void;
  let reject: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve: resolve!, reject: reject! };
};

describe("App", () => {
  beforeEach(() => {
    mockedApi.listUsers.mockResolvedValue([]);
  });

  it("renders title and loads empty state", async () => {
    render(<App />);
    expect(screen.getByText(/User App/i)).toBeInTheDocument();
    await waitFor(() => expect(mockedApi.listUsers).toHaveBeenCalled());
    expect(screen.getByText(/No users yet/i)).toBeInTheDocument();
  });

  it("shows loading state while fetching users", async () => {
    const deferred = createDeferred<Awaited<ReturnType<typeof mockedApi.listUsers>>>();
    mockedApi.listUsers.mockReturnValue(deferred.promise);

    render(<App />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    deferred.resolve([]);
    await waitFor(() => expect(screen.getByText(/No users yet/i)).toBeInTheDocument());
  });

  it("shows an error when initial load fails", async () => {
    mockedApi.listUsers.mockRejectedValue(new Error("Load failed"));

    render(<App />);

    await waitFor(() => expect(screen.getByText("Load failed")).toBeInTheDocument());
  });

  it("creates a user", async () => {
    const user = userEvent.setup();
    mockedApi.createUser.mockResolvedValue({
      id: 1,
      name: "Jane",
      email: "jane@example.com",
      age: 32
    });

    render(<App />);

    await user.type(screen.getByPlaceholderText(/Jane Doe/i), "Jane");
    await user.type(screen.getByPlaceholderText(/jane@example.com/i), "jane@example.com");
    await user.type(screen.getByPlaceholderText(/30/i), "32");

    await user.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => expect(mockedApi.createUser).toHaveBeenCalled());
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("edits a user", async () => {
    mockedApi.listUsers.mockResolvedValue([
      { id: 2, name: "Old", email: "old@example.com", age: 20 }
    ]);
    mockedApi.updateUser.mockResolvedValue({
      id: 2,
      name: "New",
      email: "new@example.com",
      age: 21
    });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText("Old")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /Edit/i }));
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/Jane Doe/i);
    await user.clear(nameInput);
    await user.type(nameInput, "New");

    await user.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => expect(mockedApi.updateUser).toHaveBeenCalled());
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("keeps other users when updating", async () => {
    mockedApi.listUsers.mockResolvedValue([
      { id: 7, name: "Keep", email: "keep@example.com", age: 40 },
      { id: 8, name: "Change", email: "change@example.com", age: 22 }
    ]);
    mockedApi.updateUser.mockResolvedValue({
      id: 8,
      name: "Changed",
      email: "changed@example.com",
      age: 23
    });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText("Change")).toBeInTheDocument());
    await user.click(screen.getAllByRole("button", { name: /Edit/i })[1]);

    const nameInput = screen.getByPlaceholderText(/Jane Doe/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Changed");

    await user.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => expect(screen.getByText("Changed")).toBeInTheDocument());
    expect(screen.getByText("Keep")).toBeInTheDocument();
  });

  it("shows an error when update fails", async () => {
    mockedApi.listUsers.mockResolvedValue([
      { id: 6, name: "Bad", email: "bad@example.com", age: 21 }
    ]);
    mockedApi.updateUser.mockRejectedValue(new Error("Update failed"));

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText("Bad")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /Edit/i }));

    const nameInput = screen.getByPlaceholderText(/Jane Doe/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Badly");

    await user.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => expect(screen.getByText("Update failed")).toBeInTheDocument());
  });

  it("cancels an edit", async () => {
    mockedApi.listUsers.mockResolvedValue([
      { id: 4, name: "Cancel", email: "cancel@example.com", age: 25 }
    ]);

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText("Cancel")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /Edit/i }));
    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancel/i })).not.toBeInTheDocument();
  });

  it("deletes a user", async () => {
    mockedApi.listUsers.mockResolvedValue([
      { id: 3, name: "Delete", email: "del@example.com", age: 18 }
    ]);
    mockedApi.deleteUser.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText("Delete", { selector: "strong" })).toBeInTheDocument()
    );
    await user.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => expect(mockedApi.deleteUser).toHaveBeenCalled());
    expect(screen.queryByText("Delete", { selector: "strong" })).not.toBeInTheDocument();
  });

  it("shows an error when delete fails", async () => {
    mockedApi.listUsers.mockResolvedValue([
      { id: 5, name: "Fail", email: "fail@example.com", age: 33 }
    ]);
    mockedApi.deleteUser.mockRejectedValue(new Error("Delete failed"));

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText("Fail")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => expect(screen.getByText("Delete failed")).toBeInTheDocument());
  });
});
