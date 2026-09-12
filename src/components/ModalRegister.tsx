import { useState } from "react";
import type { Registrant} from "../libs/Registrant";

type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
  extraItems: string[]; // contains list of id
};

const STORAGE_KEY = "lab14Storages";

function loadTask(): Registrant[] {
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

//---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];
// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];


export default function ModalRegister( {onClose} : {onClose:()=>void}) {
  const [form, setForm] = useState<RegisterForm>({
    fname: "",
    lname: "",
    plan: "",
    gender: "",
    extraItems: [],
  });

  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
  });

  const updateForm = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const updateItems = (value: string) => {
    const Items = form.extraItems;
    if(Items.findIndex((i) => i === value) === -1){
      Items.push(value);
      setForm((prev) => ({...prev, ["extraItems"]: Items}))
    } else {
      setForm((prev) => ({...prev, ["extraItems"]: Items.filter((i) => i !== value)}))
    }
  };

  const computeTotalPayment = () => {
    let total = 0;
    const selectedPlan = plans.find((p) => p.id === form.plan);
    if (selectedPlan) total += selectedPlan.price;

    const extraTotal = form.extraItems.reduce((acc, i) => {
      const item = extraItems.find((e) => e.id === i);
      if(item) return item.price + acc;
      return acc;
    }
    ,0);

    return total + extraTotal;
  };

  const registerBtnOnClick = () => {
    const newErrors = {
      fname: form.fname === "",
      lname: form.lname === "",
      plan: form.plan === "",
      gender: form.gender === "",
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((isError) => isError);
    if (hasError) return;

    setForm({
      fname: "",
      lname: "",
      plan: "",
      gender: "",
      extraItems: [],
    })
    setAgree(false);

    const totalPrice = computeTotalPayment();
    alert(
      `Registration complete. Please pay money for ${totalPrice.toLocaleString()} THB.`,
    );

    const regs = loadTask();
    const totalreg = regs.length;
    const newReg: Registrant = {
      id: totalreg + 1,
      fullName: `${form.fname} ${form.lname}`,
      gender: form.gender,
      plan: `${(plans.find((i) => i.id === form.plan) === null) ? "" : plans.find((i) => i.id === form.plan)?.label}`,
      extraItems: extraItems.filter((i) => {
        const index = form.extraItems.findIndex((item) => item === i.id);
        return (index !== -1);
      }).map((i)=>i.label),
      total: totalPrice
    }
    
    regs.push(newReg);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-flex gap-2">
              
              <div>
                <label className="form-label">First name</label>
                <input 
                  className={`form-control ${errors.fname ? "is-invalid" : ""}`} 
                  onChange={(e) => updateForm("fname", e.target.value)} 
                  value={form.fname} 
                />
                <div className="invalid-feedback">Invalid first name</div>
              </div>

              <div>
                <label className="form-label">Last name</label>
                <input 
                  className={`form-control ${errors.lname ? "is-invalid" : ""}`} 
                  onChange={(e) => updateForm("lname", e.target.value)} 
                  value={form.lname} 
                />
                <div className="invalid-feedback">Invalid last name</div>
              </div>
            
            </div>
            <div className="mt-2">
              <label className="form-label">Plan</label>
              <select 
                  className={`form-select ${errors.plan ? "is-invalid" : ""}`}
                  onChange={(e) => updateForm("plan", e.target.value)} 
                  value={form.plan} 
                  >
                <option value="">Please select..</option>
                {plans.map((p)=>
                  <option key={p.id} value={p.id}>
                  {p.label} ({p.price.toLocaleString()} THB)
                  </option>)}
                {/* <option value="funrun">Fun run 5.5 Km (500 THB)</option>
                <option value="mini">Mini Marathon 10 Km (800 THB)</option>
                <option value="half">Half Marathon 21 Km (1,200 THB)</option>
                <option value="full">
                  Full Marathon 42.195 Km (1,500 THB)
                </option> */}
              </select>
              <div className="invalid-feedback">Please select a Plan</div>
            </div>
            <div className="mt-2">
              <label className="form-label">Gender</label>
              <div>
                <input 
                  className="me-2 form-check-input" 
                  type="radio"
                  checked={form.gender === "male"}
                  onClick={() => updateForm("gender", form.gender === "male"? "": "male")} 
                  onChange={()=>{}}
                />
                Male 👨
                <input 
                  className="mx-2 form-check-input" 
                  type="radio" 
                  checked={form.gender === "female"}
                  onClick={() => updateForm("gender", form.gender === "female"? "": "female")} 
                  onChange={()=>{}}
                />
                Female 👩
              </div>
              {
                errors.gender && <div className="text-danger">Please select gender</div>
              }
            </div>
            {/* Extra Items */}
            <div>
              <label className="form-label">Extra Item(s)</label>
              {
                extraItems.map((e)=>
                <div key={e.id}>
                <input 
                  className="me-2 form-check-input" 
                  type="checkbox" 
                  checked={form.extraItems.findIndex((x) => x === e.id) !== -1}
                  onChange={()=>updateItems(e.id)}
                  />
                <label className="form-check-label">{e.label} ({e.price} THB)</label>
              </div>)
              }
              
              {
                (form.extraItems.length === extraItems.length)
                && <span className="text-success d-block">(20% Discounted)</span>}
            </div>

            <div className="alert alert-primary mt-3" role="alert">
              Promotion📢 Buy all items to get 20% Discount
            </div>

            <div>Total Payment : {computeTotalPayment().toLocaleString()} THB</div>
          </div>

          <div className="modal-footer">            
            <div>
              <input
                className="mx-2"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              /> I agree to the terms and conditions

              <button
                  className="btn btn-success ms-3"
                  onClick={registerBtnOnClick}
                  disabled={!agree}>
                  Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
