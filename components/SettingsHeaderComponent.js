import { useRouter } from 'next/router'

export default function SettingsHeader({ title, isTop }) {
    const router = useRouter();
    return (
        <div class="header">
            <div onClick={() => router.back()}>
                <svg width="36" height="37" viewBox="0 0 36 37" xmlns="http://www.w3.org/2000/svg" style={{ display: (isTop ? 'none' : 'block') }}>
                    <path
                        d="M11.25 33.296C10.5 33.296 9.6 33.146 8.85 32.696C7.05 31.796 6 30.146 6 28.196V8.39595C6 6.44595 7.05 4.79595 8.85 3.89595C10.65 2.99595 12.9 3.14595 14.55 4.34595L27.6 14.246C28.95 15.296 29.7 16.646 29.7 18.296C29.7 19.946 28.95 21.446 27.6 22.346L14.55 32.246C13.65 32.996 12.45 33.296 11.25 33.296Z" />
                </svg>
            </div>
            <h4>{title}</h4>
            <div></div>
        </div>
    )
}