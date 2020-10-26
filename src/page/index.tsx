import { createCell, Fragment } from 'web-cell';
import { CellRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';

import { history } from '../model';
import WebCell_0 from '../image/WebCell-0.png';

import { Hello } from './Hello';
import { CellClock } from './Clock';

const menu = [
    {
        title: 'Hello',
        href: 'hello'
    },
    {
        title: 'Clock',
        href: 'clock'
    },
    {
        title: 'GitHub source',
        href: 'https://github.com/EasyWebApp/scaffold'
    }
];

export function PageFrame() {
    return (
        <>
            <NavBar
                narrow
                brand={
                    <img
                        alt="WebCell scaffold"
                        src={WebCell_0}
                        style={{ width: '2rem' }}
                    />
                }
            >
                {menu.map(({ title, ...props }) => (
                    <NavLink {...props}>{title}</NavLink>
                ))}
            </NavBar>

            <CellRouter
                className="container"
                style={{ minHeight: '60vh' }}
                history={history}
                routes={[
                    {
                        paths: ['clock'],
                        component: CellClock
                    },
                    {
                        paths: ['hello', ''],
                        component: Hello
                    }
                ]}
            />
            <footer className="text-center bg-light py-5">
                Proudly developed with
                <a
                    className="mx-1"
                    target="_blank"
                    href="https://web-cell.dev/"
                >
                    WebCell v2
                </a>
                &amp;
                <a
                    className="mx-1"
                    target="_blank"
                    href="https://web-cell.dev/BootCell/"
                >
                    BootCell v1
                </a>
            </footer>
        </>
    );
}
