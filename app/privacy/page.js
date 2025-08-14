export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">นโยบายความเป็นส่วนตัว</h1>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">การเก็บรวบรวมข้อมูล</h2>
            <p className="text-gray-600 mb-6">
              เราเก็บรวบรวมข้อมูลส่วนบุคคลที่คุณให้ไว้โดยตรง เช่น ชื่อ อีเมล และข้อมูลโปรไฟล์ เมื่อคุณสมัครสมาชิกหรือใช้บริการของเรา
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">การใช้ข้อมูล</h2>
            <p className="text-gray-600 mb-6">เราใช้ข้อมูลของคุณเพื่อ:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>ให้บริการและปรับปรุงแอปพลิเคชัน</li>
              <li>ติดต่อสื่อสารกับคุณ</li>
              <li>รักษาความปลอดภัยของบัญชี</li>
              <li>ปฏิบัติตามกฎหมายที่เกี่ยวข้อง</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">การแบ่งปันข้อมูล</h2>
            <p className="text-gray-600 mb-6">
              เราจะไม่แบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลที่สาม ยกเว้นในกรณีที่จำเป็นตามกฎหมายหรือเพื่อปกป้องสิทธิของเรา
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">ความปลอดภัยของข้อมูล</h2>
            <p className="text-gray-600 mb-6">
              เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ จากการเข้าถึง การใช้ หรือการเปิดเผยโดยไม่ได้รับอนุญาต
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">สิทธิของคุณ</h2>
            <p className="text-gray-600 mb-6">
              คุณมีสิทธิในการเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ หากต้องการใช้สิทธิดังกล่าว กรุณาติดต่อเราผ่านช่องทางที่ระบุไว้
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">การติดต่อ</h2>
            <p className="text-gray-600 mb-6">
              หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อเราที่ maizananuto@gmail.com
            </p>

            <p className="text-sm text-gray-500 mt-8">
              นโยบายนี้มีผลบังคับใช้ตั้งแต่วันที่ {new Date().toLocaleDateString("th-TH")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
