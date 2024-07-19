'use server'
import {DataTable} from '@/components/table/DataTable'
import StatCard from '@/components/StatCard'
import { getRecentAppointments } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {columns} from '@/components/table/columns'

const Admin = async () => {
    
    const appointments = await getRecentAppointments();

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
            <Link 
            href='/'
            className='cursor-pointer'
            >
                <Image 
                src='/assets/icons/logo-full.png'
                height={180}
                width={180}
                alt='logo'
                />
            </Link>

            <p className='text-16-semibold'>Admin Dashboard</p>
        </header>

        <main className='admin-main'>
            <section className='w-full space-y-4'>
                <h1 className='header'>
                    Welcome!
                </h1>
                <p className='text-dark-700'>
                    Start with managing new appointments.
                </p>
            </section>
            <section className='admin-stat'>
                <StatCard 
                type="appointments"
                count={appointments.scheduledCount}
                label="Scheduled appointments"
                icon="/assets/icons/appointments.svg"
                />
                <StatCard 
                type="pending"
                count={appointments.pendingCount}
                label="Pending appointments"
                icon="/assets/icons/pending.svg"
                />
                <StatCard 
                type="cancelled"
                count={appointments.cancelledCount}
                label="Cancelled appointments"
                icon="/assets/icons/cancelled.svg"
                />

            </section>

            <DataTable 
            data={appointments.documents}
            columns={columns}
            />
           
        </main>
    </div>
  )
}

export default Admin