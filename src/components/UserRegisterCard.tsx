import type { Registrant } from "../libs/Registrant";

export default function UserRegisterCard( registrant : Registrant) {
  return (
    <div className="d-flex flex-column gap-2 mb-2">
      <div className="card p-3">
        <div className="d-flex justify-content-between">
          <span className="fw-semibold">
            {registrant.fullName}
          </span>
          <span>{registrant.total.toLocaleString()} THB</span>
        </div>
      
        <small className="text-muted">
          {registrant.plan} · {registrant.gender === "male" ? "👨 Male" : "👩 Female"}
        </small>
      
        <div className="mt-1 d-flex flex-wrap gap-1">
          {registrant.extraItems.map((i) => 
            <span className="badge text-bg-light border" key={i}>
              {i}
            </span>)}
        </div>
      </div>
    </div>
    );
}