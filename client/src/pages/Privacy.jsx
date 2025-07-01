import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Code, ShieldCheck, History, Award } from "lucide-react";
import { CheckCircle } from "lucide-react";

export default function Privacy() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy & Security</h1>
            <p className="text-slate-600">Learn how HealthChain protects your medical data</p>
          </div>

          <div className="space-y-8">
            {/* End-to-End Encryption */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-medical-primary/10 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      End-to-End Encryption
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Your medical records are encrypted using industry-standard AES-256 encryption before being stored on the blockchain. Only you hold the private keys to decrypt your data.
                    </p>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Data encrypted at rest and in transit
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Private keys never leave your device
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Zero-knowledge architecture
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ICP Smart Contract Ownership */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-medical-secondary/10 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      ICP Smart Contract Ownership
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Your data is stored in smart contracts on the Internet Computer Protocol, ensuring true ownership and preventing unauthorized access by third parties, including HealthChain itself.
                    </p>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Decentralized storage on ICP blockchain
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Smart contracts enforce access rules
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        No single point of failure
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient-Controlled Access */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-medical-accent/10 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      Patient-Controlled Access
                    </h3>
                    <p className="text-slate-600 mb-4">
                      You have complete control over who can access your medical records. Grant or revoke access to healthcare providers and researchers at any time with granular permissions.
                    </p>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Granular permission controls
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Instant access revocation
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Time-limited access grants
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Immutable Audit Trail */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-medical-primary/10 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      Immutable Data Logs (Auditability)
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Every access to your medical records is permanently recorded on the blockchain, creating an immutable audit trail that ensures transparency and accountability.
                    </p>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Permanent access logs
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Tamper-proof record keeping
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-medical-secondary h-5 w-5 mr-2" />
                        Full transparency and accountability
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card className="bg-medical-gradient border-medical-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  HIPAA Compliant & Secure
                </h3>
                <p className="text-slate-600">
                  HealthChain is designed to meet HIPAA compliance requirements and follows industry best practices for medical data security and privacy protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
