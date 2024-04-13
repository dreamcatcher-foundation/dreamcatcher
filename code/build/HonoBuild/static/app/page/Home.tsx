import React from 'react';
import {Page, Layer, Col, Row} from '../component/Base.tsx';
import {Pulse0, Pulse1, BlurDot0, BlurDot1} from '../component/Effects.tsx';
import {ConnectButton} from '../component/ConnectButton.tsx';
import {NavbarItem, Navbar} from '../component/Navbar.tsx';
import {LogoAndBrand} from '../component/LogoAndBrand.tsx';
import {RenderedRow} from '../component/Rendered.tsx';
import {Header} from '../component/Header.tsx';
import {Welcome} from '../component/Welcome.tsx';

export default function Home() {
    return (
        <Page>
            <Layer>
                <Pulse0></Pulse0>
                <Pulse1></Pulse1>
                <BlurDot0></BlurDot0>
                <BlurDot1></BlurDot1>
            </Layer>
            <Layer style={{justifyContent: 'space-between'}}>
                <RenderedRow node='NAVBAR' w='100%' h='auto' initStyle={{gap: '40px', justifyContent: 'space-between', padding: '40px'}} cooldown={100n}>
                    <LogoAndBrand></LogoAndBrand>
                    <Navbar>
                        <NavbarItem node='NAVBAR_ITEM_1' to='/' className='swing-in-top-fwd' text0='01' text1='Home'></NavbarItem>
                        <NavbarItem node='NAVBAR_ITEM_2' to='/' className='swing-in-top-fwd' text0='02' text1='Protocol'></NavbarItem>
                        <NavbarItem node='NAVBAR_ITEM_3' to='/' className='swing-in-top-fwd' text0='03' text1='Governance'></NavbarItem>
                        <NavbarItem node='NAVBAR_ITEM_4' to='/' className='swing-in-top-fwd' text0='04' text1='Whitepaper'></NavbarItem>
                        <NavbarItem node='NAVBAR_ITEM_5' to='/' className='swing-in-top-fwd' text0='05' text1='Get Started'></NavbarItem>
                    </Navbar>
                    <ConnectButton></ConnectButton>
                </RenderedRow>
                <Welcome></Welcome>
            </Layer>
        </Page>
    );
}