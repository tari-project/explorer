//  Copyright 2022. The Tari Project
//
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
//  following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//  disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
//  following disclaimer in the documentation and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
//  products derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
//  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
//  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
//  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Header from '../routes/Header/Header';
import StickyHeader from '../routes/Header/StickyHeader';
import TopBar from '../routes/Header/TopBar';
import { darkTheme, lightTheme } from './themes';

import HeaderTitle from '../routes/Header/HeaderTitle';

interface PageLayoutProps {
  title?: string;
  subTitle?: string;
  customHeader?: any;
}

export default function PageLayout({
  title,
  subTitle,
  customHeader,
}: PageLayoutProps) {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Grid container spacing={0} className="main-bg">
          <StickyHeader>
            <TopBar />
            <Header />
          </StickyHeader>
          {customHeader ? (
            customHeader
          ) : (
            <HeaderTitle title={title || ''} subTitle={subTitle || ''} />
          )}
          <ThemeProvider theme={lightTheme}>
            <Container
              maxWidth="xl"
              style={{
                paddingTop: lightTheme.spacing(5),
                paddingBottom: lightTheme.spacing(5),
                background: lightTheme.palette.background.default,
              }}
            >
              <Grid container spacing={3}>
                <Outlet />
              </Grid>
            </Container>
          </ThemeProvider>
        </Grid>
      </ThemeProvider>
    </>
  );
}
