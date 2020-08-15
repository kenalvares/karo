<template>
  <main class="home-window">
    <header class="showcase">
      <div class="showcase-top">
        <v-spacer />
      </div>
      <div class="showcase-content">
        <h1>Project Management.</h1>
        <p>Made Easy.</p>
        <a href="/sign-up" class="btn btn-xl"
          >Sign Up<v-icon>keyboard_arrow_right</v-icon></a
        >
      </div>
    </header>
    <section class="tabs">
      <div class="container">
        <div id="tab-1" class="tab-item">
          <i class="fas fa-door-open fa-3x"></i>
          <p class="hide-sm">Works Out-of-the-Box</p>
        </div>
      </div>
    </section>

    <section class="tab-content">
      <div class="container">
        <!-- Tab Content 1 -->
        <div id="tab-1-content" class="tab-content-item">
          <div class="tab-1-content-inner">
            <div>
              <p class="text-lg">
                Karo can be dropped into your existing workflow easily and also
                plays well with SCRUM / Agile projects.
              </p>
              <a href="/sign-up" class="btn btn-lg">Get Your Team on Karo</a>
            </div>
            <img :src="team" alt="" />
          </div>
        </div>
      </div>
    </section>

    <section class="tabs">
      <div class="container">
        <div id="tab-2" class="tab-item">
          <i class="fas fa-tablet-alt fa-3x"></i>
          <p class="hide-sm">Manage Projects Anywhere</p>
        </div>
      </div>
    </section>

    <section class="tab-content">
      <div class="container">
        <!-- Tab Content 2 -->
        <div id="tab-2-content" class="tab-content-item">
          <div class="tab-2-content-top">
            <p class="text-lg">
              Karo is a cross-platform, single-page, progressive web application
              that enables you to manage projects - <em>anywhere.</em>
            </p>
            <a href="/sign-up" class="btn btn-lg">Get Your Team on Karo</a>
          </div>
          <div class="tab-2-content-bottom">
            <div>
              <img :src="tv" alt="" />
              <p class="text-md">
                Dashboard TV
              </p>
              <p class="text-dark">
                Cast your Karo dashboard to the office TV so your entire team
                can track their progress
              </p>
            </div>
            <div>
              <img :src="tab" alt="" />
              <p class="text-md">
                Karo - On the Go
              </p>
              <p class="text-dark">
                Check your daily tasks, chat with team mates and get stuff done
                on the go
              </p>
            </div>
            <div>
              <img :src="laptop" alt="" />
              <p class="text-md">
                Use Any Computer
              </p>
              <p class="text-dark">
                Sign in from any computer and get things done like never before
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="tabs">
      <div class="container">
        <div id="tab-3" class="tab-item">
          <i class="fas fa-tags fa-3x"></i>
          <p class="hide-sm">Packed With Features</p>
        </div>
      </div>
    </section>

    <section class="tab-content">
      <div class="container">
        <!-- Tab Content 3 -->
        <div id="tab-3-content" class="tab-content-item">
          <div class="text-center">
            <p class="text-lg">
              Why use different apps to communicate, collaborate, track
              performance, manage projects, etc?
            </p>
            <a href="/sign-up" class="btn btn-lg">Get Your Team on Karo</a>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th class="highlight highlight-top">Karo</th>
                <th>Asana</th>
                <th>Trello</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Create Teams</td>
                <td class="highlight highlight-mid"><v-icon>check</v-icon></td>
                <td><v-icon>check</v-icon></td>
                <td><v-icon>check</v-icon></td>
              </tr>
              <tr>
                <td>Manage Projects</td>
                <td class="highlight highlight-mid"><v-icon>check</v-icon></td>
                <td><v-icon>check</v-icon></td>
                <td><v-icon>check</v-icon></td>
              </tr>
              <tr>
                <td>SCRUM / Agile Team Friendly</td>
                <td class="highlight highlight-mid"><v-icon>check</v-icon></td>
                <td><v-icon>check</v-icon></td>
                <td><v-icon>clear</v-icon></td>
              </tr>
              <tr>
                <td>Chats & Channels</td>
                <td class="highlight highlight-mid"><v-icon>check</v-icon></td>
                <td><v-icon>clear</v-icon></td>
                <td><v-icon>clear</v-icon></td>
              </tr>
              <tr>
                <td>Reports & Data Analysis</td>
                <td class="highlight highlight-mid"><v-icon>check</v-icon></td>
                <td><v-icon>clear</v-icon></td>
                <td><v-icon>clear</v-icon></td>
              </tr>
              <tr>
                <td>Seamlessly Cross-Platform</td>
                <td class="highlight highlight-end"><v-icon>check</v-icon></td>
                <td><v-icon>clear</v-icon></td>
                <td><v-icon>clear</v-icon></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.home-window {
  background-color: #333;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5;
  margin-bottom: 2rem;
}

.highlight {
  border: 2px solid rgba(55, 255, 55, 0.5);
  background-color: rgba(55, 255, 55, 0.1);
}

.highlight-top {
  border-bottom-width: 0;
}
.highlight-mid {
  border-bottom-width: 0;
  border-top-width: 0;
}
.highlight-end {
  border-top-width: 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
}

h1,
h2,
h3,
h4 {
  color: #fff;
}

a {
  color: #fff;
  text-decoration: none;
}

p {
  margin: 0.5rem 0;
}

img {
  width: 100%;
}

.showcase {
  width: 100%;
  height: 93vh;
  position: relative;
  background: url("../assets/showcase-background.jpg") no-repeat center
    center/cover;
}

.showcase::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: inset 120px 100px 250px #000000, inset -120px -100px 250px #000000;
}

.showcase-top {
  position: relative;
  z-index: 2;
  height: 90px;
}

.showcase-top img {
  width: 170px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-left: 0;
}

.showcase-top a {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
}

.showcase-content {
  position: relative;
  z-index: 2;
  width: 65%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 9rem;
}

.showcase-content h1 {
  font-weight: 700;
  font-size: 5.2rem;
  line-height: 1.1;
  margin: 0 0 2rem;
}

.showcase-content p {
  text-transform: uppercase;
  color: #fff;
  font-weight: 400;
  font-size: 1.9rem;
  line-height: 1.25;
  margin: 0 0 2rem;
}

/* Tabs */
.tabs {
  background: #141414;
  padding-top: 1rem;
  border-bottom: 3px solid #3d3d3d;
  border-right: none;
}

.tabs .container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 1rem;
  align-items: center;
  justify-content: center;
  text-align: left;
}

.tabs p {
  font-size: 1.4rem;
  font-weight: 300;
  padding-top: 0.5rem;
}

.tabs .container > div {
  padding: 1.5rem 0;

  border-bottom: #e50914 4px solid;
}

.tabs .container > div:hover {
  color: #fff;
  cursor: pointer;
}

/* Tab Content */
.tab-content {
  padding: 3rem 0;
  background: #000;
  color: #fff;
}

/* Hide initial content */
#tab-1-content,
#tab-2-content,
#tab-3-content {
  display: block !important;
  opacity: 1 !important;
  transition: all 1000 ease-in;
}
#tab-1-content .tab-1-content-inner {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
  align-items: center;
  justify-content: center;
}

#tab-2-content .tab-2-content-top {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 1rem;
  justify-content: center;
  align-items: center;
}

#tab-2-content .tab-2-content-bottom {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  text-align: center;
}

.table {
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
  border-spacing: 0;
}

.table thead th {
  text-transform: uppercase;
  padding: 0.8rem;
}

.table tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  border-width: 0;
}

.table tbody tr td {
  color: #999;
  padding: 0.8rem 1.2rem;
  text-align: center;
}

.table tbody tr td:first-child {
  text-align: left;
}

.table tbody tr:nth-child(odd) {
  background: #222;
}

/* Container */
.container {
  max-width: 70%;
  margin: auto;
  overflow: hidden;
  padding: 0 2rem;
}

/* Text Styles */
.text-xl {
  font-size: 2rem;
}

.text-lg {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.text-md {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.text-center {
  text-align: center;
}

.text-dark {
  color: #999;
}

/* Buttons */
.btn {
  display: inline-block;
  background: #e50914;
  color: #fff;
  padding: 0.4rem 1.3rem;
  font-size: 1rem;
  text-align: center;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: opacity 0.2s ease-in;
  outline: none;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
  border-radius: 2px;
}

.btn:hover {
  opacity: 0.9;
}

.btn-rounded {
  border-radius: 5px;
}

.btn-xl {
  font-size: 2rem;
  padding: 1.5rem 2.1rem;
  text-transform: uppercase;
}

.btn-lg {
  font-size: 1rem;
  padding: 0.8rem 1.3rem;
  text-transform: uppercase;
}

.btn-icon {
  margin-left: 1rem;
}

@media (max-width: 960px) {
  .showcase {
    height: 70vh;
  }

  .hide-sm {
    display: none;
  }

  .showcase-top img {
    top: 30%;
    left: 5%;
    transform: translate(0);
  }

  .showcase-content h1 {
    font-size: 3.7rem;
    line-height: 1;
  }

  .showcase-content p {
    font-size: 1.5rem;
  }

  .btn-xl {
    font-size: 1.5rem;
    padding: 1.4rem 2rem;
    text-transform: uppercase;
  }

  .text-xl {
    font-size: 1.5rem;
  }

  .text-lg {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .text-md {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 700px) {
  .showcase::after {
    background: rgba(0, 0, 0, 0.6);
    box-shadow: inset 80px 80px 150px #000000, inset -80px -80px 150px #000000;
  }

  .showcase-content h1 {
    font-size: 2.5rem;
    line-height: 1;
  }

  .showcase-content p {
    font-size: 1rem;
  }

  #tab-1-content .tab-1-content-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  #tab-2-content .tab-2-content-top {
    display: block;
    text-align: center;
  }

  #tab-2-content .tab-2-content-bottom {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem;
    text-align: center;
  }

  .btn-xl {
    font-size: 1rem;
    padding: 1.2rem 1.6rem;
    text-transform: uppercase;
  }
}

@media (max-height: 600px) {
  .showcase-content {
    margin-top: 3rem;
  }
}
</style>

<script>
import store from "@/store/index";
export default {
  name: "home",
  created() {
    store.commit("setPageTitle", "Karo");
  },
  computed: {
    tv() {
      return require("@/assets/tv.png");
    },
    tab() {
      return require("@/assets/tab.png");
    },
    laptop() {
      return require("@/assets/laptop.png");
    },
    team() {
      return require("@/assets/team.png");
    }
  }
};
</script>
