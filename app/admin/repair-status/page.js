"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function RepairManagement() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [note, setNote] = useState('');
  const db = getFirestore(app);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "repairs"));
        const repairsData = [];
        querySnapshot.forEach((doc) => {
          repairsData.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          });
        });
        
        setRepairs(repairsData.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error("Error fetching repairs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, []);

  const updateRepairStatus = async (repairId, status) => {
    try {
      await updateDoc(doc(db, "repairs", repairId), {
        status,
        updatedAt: new Date(),
        technicianNote: note
      });
      
      setRepairs(repairs.map(repair => 
        repair.id === repairId ? { ...repair, status, technicianNote: note } : repair
      ));
      
      setSelectedRepair(null);
      setNote('');
    } catch (error) {
      console.error("Error updating repair:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">จัดการคำขอซ่อม</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* รายการคำขอซ่อม */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 border-b">
            <div className="col-span-2 font-medium">เลขที่</div>
            <div className="col-span-3 font-medium">ลูกค้า</div>
            <div className="col-span-3 font-medium">บริการ</div>
            <div className="col-span-2 font-medium">สถานะ</div>
            <div className="col-span-2 font-medium">จัดการ</div>
          </div>
          
          {repairs.map((repair) => (
            <div key={repair.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50">
              <div className="col-span-2">REP-{repair.id.slice(0, 6).toUpperCase()}</div>
              <div className="col-span-3">
                <div>{repair.customerName}</div>
                <div className="text-sm text-gray-500">{repair.customerEmail}</div>
              </div>
              <div className="col-span-3">{repair.serviceType}</div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  repair.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                  repair.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  repair.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {repair.status === 'pending' ? 'รอดำเนินการ' :
                   repair.status === 'in_progress' ? 'กำลังซ่อม' :
                   repair.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                </span>
              </div>
              <div className="col-span-2">
                <button 
                  onClick={() => setSelectedRepair(repair)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  จัดการ
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* แผงจัดการ */}
        <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-6">
          <h2 className="text-lg font-bold mb-4">
            {selectedRepair ? `จัดการคำขอ REP-${selectedRepair.id.slice(0, 6).toUpperCase()}` : 'เลือกรายการซ่อม'}
          </h2>
          
          {selectedRepair && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เพิ่มหมายเหตุสำหรับลูกค้า"
                  className="w-full border rounded-md p-2 text-sm h-20"
                  defaultValue={selectedRepair.technicianNote || ''}
                />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => updateRepairStatus(selectedRepair.id, 'in_progress')}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                    selectedRepair.status === 'in_progress' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  เริ่มดำเนินการ
                </button>
                
                <button
                  onClick={() => updateRepairStatus(selectedRepair.id, 'completed')}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                    selectedRepair.status === 'completed' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  เสร็จสิ้น
                </button>
                
                <button
                  onClick={() => updateRepairStatus(selectedRepair.id, 'rejected')}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                    selectedRepair.status === 'rejected' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  ยกเลิกคำขอ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}