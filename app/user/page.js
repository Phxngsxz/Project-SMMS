"use client";

import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  Search,
  LogOut,
  Activity,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
} from "lucide-react";

export default function UserPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 p-8 space-y-6">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">ยินดีต้อนรับ!</CardTitle>
              <CardDescription className="text-primary-foreground/80">คุณคือ User - เข้าสู่ระบบเรียบร้อยแล้ว</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">งานทั้งหมด</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 จากเมื่อวาน</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">งานเสร็จแล้ว</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">75% ความสำเร็จ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">งานค้างอยู่</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">ต้องทำให้เสร็จ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">คะแนนประสิทธิภาพ</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">+5% จากเดือนที่แล้ว</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  ความคืบหน้าโปรเจกต์
                </CardTitle>
                <CardDescription>โปรเจกต์ที่กำลังดำเนินการ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>เว็บไซต์ E-commerce</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>แอปมือถือ</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ระบบจัดการสต็อก</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  กิจกรรมล่าสุด
                </CardTitle>
                <CardDescription>อัปเดตล่าสุดในระบบ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">งาน "ออกแบบ UI" เสร็จสิ้น</p>
                      <p className="text-xs text-muted-foreground">2 ชั่วโมงที่แล้ว</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">เพิ่มสมาชิกใหม่ในทีม</p>
                      <p className="text-xs text-muted-foreground">5 ชั่วโมงที่แล้ว</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">อัปเดตเอกสารโปรเจกต์</p>
                      <p className="text-xs text-muted-foreground">1 วันที่แล้ว</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">แจ้งเตือน: งานใกล้ครบกำหนด</p>
                      <p className="text-xs text-muted-foreground">2 วันที่แล้ว</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                งานที่ต้องทำวันนี้
              </CardTitle>
              <CardDescription>รายการงานที่มีกำหนดส่งวันนี้</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium">ทบทวนโค้ด API Authentication</p>
                    <p className="text-sm text-muted-foreground">กำหนดส่ง: 17:00 น.</p>
                  </div>
                  <Badge variant="outline">สำคัญ</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">ประชุมทีมรายสัปดาห์</p>
                    <p className="text-sm text-muted-foreground">เวลา: 14:00 - 15:00 น.</p>
                  </div>
                  <Badge variant="secondary">ประชุม</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">อัปเดตเอกสารผู้ใช้</p>
                    <p className="text-sm text-muted-foreground">กำหนดส่ง: 20:00 น.</p>
                  </div>
                  <Badge variant="outline">ปกติ</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>การจัดการบัญชี</CardTitle>
              <CardDescription>จัดการการเข้าสู่ระบบและความปลอดภัย</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
                <LogOut className="w-4 h-4 mr-2" />
                ออกจากระบบ
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
      </div>
    </div>
  );
}
