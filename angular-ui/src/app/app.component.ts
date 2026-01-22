import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "./user.service";
import { User, UserCreate } from "./user.model";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header>
        <h1>User App</h1>
        <p>Basic CRUD operations</p>
      </header>

      <section class="card">
        <h2>{{ editingId() === null ? "Create User" : "Edit User" }}</h2>
        <div class="grid">
          <label>
            Name
            <input
              [ngModel]="formName()"
              (ngModelChange)="formName.set($event)"
              placeholder="Jane Doe"
            />
          </label>
          <label>
            Email
            <input
              [ngModel]="formEmail()"
              (ngModelChange)="formEmail.set($event)"
              placeholder="jane@example.com"
              type="email"
            />
          </label>
          <label>
            Age
            <input
              [ngModel]="formAge()"
              (ngModelChange)="formAge.set($event === '' ? null : Number($event))"
              placeholder="30"
              type="number"
              min="0"
            />
          </label>
        </div>
        <div class="actions">
          <button [disabled]="!canSubmit()" (click)="submit()">
            {{ editingId() === null ? "Create" : "Update" }}
          </button>
          <button class="secondary" *ngIf="editingId() !== null" (click)="resetForm()">
            Cancel
          </button>
        </div>
        <p class="error" *ngIf="error()">{{ error() }}</p>
      </section>

      <section class="card">
        <h2>Users</h2>
        <p *ngIf="loading()">Loading...</p>
        <p *ngIf="!loading() && users().length === 0">No users yet</p>
        <ul class="list" *ngIf="users().length > 0">
          <li *ngFor="let user of users(); trackBy: trackById">
            <div>
              <strong>{{ user.name }}</strong>
              <div class="muted">{{ user.email }}</div>
              <div class="muted">Age: {{ user.age ?? "-" }}</div>
            </div>
            <div class="actions">
              <button class="secondary" (click)="edit(user)">Edit</button>
              <button class="danger" (click)="remove(user.id)">Delete</button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly emptyForm: UserCreate = { name: "", email: "", age: null };

  readonly users = signal<User[]>([]);
  readonly formName = signal(this.emptyForm.name);
  readonly formEmail = signal(this.emptyForm.email);
  readonly formAge = signal<number | null>(this.emptyForm.age);
  readonly editingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  readonly canSubmit = computed(
    () => this.formName().trim().length >= 2 && this.formEmail().includes("@")
  );

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  trackById(_: number, user: User) {
    return user.id;
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.listUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => this.error.set(err.message ?? "Failed to load"),
      complete: () => this.loading.set(false)
    });
  }

  submit() {
    this.error.set(null);
    const payload: UserCreate = {
      name: this.formName(),
      email: this.formEmail(),
      age: this.formAge()
    };
    if (this.editingId() === null) {
      this.userService.createUser(payload).subscribe({
        next: (created) => this.users.update((list) => [...list, created]),
        error: (err) => this.error.set(err.message ?? "Failed to create"),
        complete: () => this.resetForm()
      });
      return;
    }

    this.userService.updateUser(this.editingId()!, payload).subscribe({
      next: (updated) =>
        this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u))),
      error: (err) => this.error.set(err.message ?? "Failed to update"),
      complete: () => this.resetForm()
    });
  }

  edit(user: User) {
    this.editingId.set(user.id);
    this.formName.set(user.name);
    this.formEmail.set(user.email);
    this.formAge.set(user.age);
  }

  remove(id: number) {
    this.error.set(null);
    this.userService.deleteUser(id).subscribe({
      next: () => this.users.update((list) => list.filter((u) => u.id !== id)),
      error: (err) => this.error.set(err.message ?? "Failed to delete")
    });
  }

  resetForm() {
    this.formName.set(this.emptyForm.name);
    this.formEmail.set(this.emptyForm.email);
    this.formAge.set(this.emptyForm.age);
    this.editingId.set(null);
  }
}
