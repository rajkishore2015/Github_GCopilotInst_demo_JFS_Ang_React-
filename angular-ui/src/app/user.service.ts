import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, UserCreate, UserUpdate } from "./user.model";

const API_BASE = (window as Window & { __env?: { API_BASE_URL?: string } }).__env
  ?.API_BASE_URL ?? "http://localhost:8080";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_BASE}/api/users`);
  }

  createUser(payload: UserCreate): Observable<User> {
    return this.http.post<User>(`${API_BASE}/api/users`, payload);
  }

  updateUser(id: number, payload: UserUpdate): Observable<User> {
    return this.http.put<User>(`${API_BASE}/api/users/${id}`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/api/users/${id}`);
  }
}
