import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppComponent } from "./app.component";

const API_BASE = "http://localhost:8080";

describe("AppComponent", () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("renders and loads users", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${API_BASE}/api/users`);
    expect(req.request.method).toBe("GET");
    req.flush([]);

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain("User App");
  });

  it("creates user", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE}/api/users`).flush([]);

    fixture.componentInstance.formName.set("Jane");
    fixture.componentInstance.formEmail.set("jane@x.com");
    fixture.componentInstance.formAge.set(30);
    fixture.componentInstance.submit();

    const postReq = httpMock.expectOne(`${API_BASE}/api/users`);
    expect(postReq.request.method).toBe("POST");
    postReq.flush({ id: 1, name: "Jane", email: "jane@x.com", age: 30 });

    fixture.detectChanges();
    expect(fixture.componentInstance.users().length).toBe(1);
  });

  it("deletes user", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE}/api/users`).flush([
      { id: 7, name: "Del", email: "del@x.com", age: 20 }
    ]);

    fixture.componentInstance.remove(7);
    const deleteReq = httpMock.expectOne(`${API_BASE}/api/users/7`);
    expect(deleteReq.request.method).toBe("DELETE");
    deleteReq.flush(null);

    fixture.detectChanges();
    expect(fixture.componentInstance.users().length).toBe(0);
  });
});
