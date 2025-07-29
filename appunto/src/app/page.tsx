'use client'

import { useRouter } from "next/navigation"

export default function Cover() {
    const router = useRouter();

    return  <div className="label">
                <span className="label-appunto">appunto: share culture with friends</span>
                <span className="label-description" onClick={() => router.push('/login')}>OPEN</span>
            </div>
}