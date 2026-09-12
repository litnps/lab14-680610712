import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";

const STORAGE_KEY = "lab14Storages";

function loadTask(): Registrant[] {
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export default function DashboardPage() {

  const reg = loadTask();

  return (
    <div className="container mt-4">

      <h2>Dashboard</h2>
      {
        (reg.length === 0) ? <p className="fs-6 text-muted">ยังไม่มีผู้ลงทะเบียน</p> : <p className="fs-6">มีผู้ลงทะเบียน {reg.length} คน</p> 
      }
      {
        reg.map((r) => <UserRegisterCard {... r} key={`${r.id}`}></UserRegisterCard>)
      }

    </div>
  );
}
