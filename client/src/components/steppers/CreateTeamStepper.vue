<template>
  <v-stepper v-model="teamStepper" :vertical="false">
    <v-stepper-header dark>
      <v-stepper-step :complete="teamStepper > 1" step="1">
        Team Name
      </v-stepper-step>
      <v-divider />
      <v-stepper-step :complete="teamStepper > 2" step="2"
        >Description</v-stepper-step
      >
      <v-divider />

      <v-stepper-step :complete="teamStepper > 3" step="3"
        >Members</v-stepper-step
      >
    </v-stepper-header>
    <v-stepper-items
      class="red darken-4 grey--text text--lighten-4 pa-3"
      v-if="errors"
    >
      <v-icon left class="grey--text text--lighten-4">warning</v-icon>
      {{ errors }}
    </v-stepper-items>
    <v-stepper-content step="1">
      <v-text-field
        ref="teamname"
        v-model="teamname"
        placeholder="My Awesome Team!"
        required
        counter
        label="Enter Team Name"
        :rules="teamnameMaxChars"
        @keydown.enter="step(2)"
      ></v-text-field>
      <v-btn @click="step(2)" class="mx-2">Continue</v-btn>
      <v-btn outlined @click="cancel()" dark color="grey lighten-2" class="mx-2"
        >Cancel</v-btn
      >
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-textarea
        placeholder="This team is all about..."
        hint="A short, concise introduction to your team"
        v-model="description"
        auto-grow
        label="Enter Team Description"
        counter
        :rules="descriptionMaxChars"
        @keydown.enter="step(3)"
      ></v-textarea>
      <v-btn @click="step(3)">Continue</v-btn>
      <v-btn outlined @click="cancel()" dark color="grey lighten-2" class="mx-2"
        >Cancel</v-btn
      >
    </v-stepper-content>

    <v-stepper-content step="3">
      <v-row>
        <v-col cols="11">
          <v-text-field
            ref="email"
            v-model="email"
            label="E-Mail"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn outlined medium fab color="grey" @click="addMember()">
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-simple-table fixed-header height="300px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" style="width:80%;">Email</th>
                  <th class="text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(member, i) in members" :key="member.id">
                  <td class="text-left">
                    <v-btn
                      text
                      class="pa-0 ma-0"
                      :disabled="myMemberName(i)"
                      @click="removeMember(i)"
                    >
                      <v-icon class="red--text">remove_circle</v-icon>
                    </v-btn>
                    <v-chip pill>
                      <v-avatar left :color="members[i].color">
                        {{ member.email[0] }}
                      </v-avatar>
                      {{ member.email }}
                    </v-chip>
                  </td>
                  <td class="text-left">
                    <v-combobox
                      v-model="members[i].role"
                      :items="roleNames"
                    ></v-combobox>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-btn class="ml-4" @click="createTeam()">Continue</v-btn>
      <v-btn outlined @click="cancel()" dark color="grey lighten-2" class="mx-2"
        >Cancel</v-btn
      >
    </v-stepper-content>
  </v-stepper>
</template>

<script>
/*eslint-disable no-unused-vars*/
import feathersClient from "@/feathers-client";
import store from "@/store/index";
/*eslint-disable no-console*/
export default {
  name: "CreateTeamStepper",
  props: {
    roles: Array
  },
  data: () => ({
    teamStepper: 1,
    members: [],
    count: 2,
    email: "",
    roleNames: [],
    color: ["pink", "indigo", "light-blue", "teal", "light-green", "yellow"],
    teamname: "",
    description: "",
    errors: null,
    descriptionMaxChars: [v => v.length <= 500 || "Max 500 characters"],
    teamnameMaxChars: [v => v.length <= 50 || "Max 50 characters"],
    requiredrule: [v => v === null || "Required"],
    allowCreateTeam: true
  }),
  async created() {
    this.addMe();
    for (let i = 0; i < this.roles.length; i++) {
      this.roleNames[i] = this.roles[i].role;
    }
  },
  methods: {
    cancel() {
      this.teamStepper = 1;
      this.members = [];
      this.addMe();
      this.count = 2;
      this.email = "";
      this.teamname = "";
      this.description = "";
      this.errors = null;
      this.$emit("creationCancelled");
    },
    async addMember() {
      this.email = this.email.replace(/ /g, "").toLowerCase();
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(this.email)) {
        this.errors = "Invalid email";
      } else {
        let memberAlreadyInArray = false;
        for (let i = 0; i < this.members.length; i++) {
          if (this.email == this.members[i].email) {
            memberAlreadyInArray = true;
          }
        }
        if (!memberAlreadyInArray) {
          let memberExists = false;
          this.errors = `Checking if ${this.email} is a user...`;
          let memberUserId = await this.getUserId(this.email);
          if (memberUserId === null || memberUserId === undefined) {
            this.errors = `${this.email} is not a user`;
            console.log(memberUserId, this.email);
            memberExists = false;
          } else {
            this.errors = null;
            memberExists = true;
          }
          if (memberExists) {
            this.members.push({
              id: this.count,
              email: this.email,
              color: this.randomColor()
            });
            this.count += 1;
            this.email = "";
          }
        } else {
          this.errors = `${this.email} has already been added`;
        }
      }
    },
    addMe() {
      const user = store.getters.getUserData;
      let me = {
        id: 1
      };
      me.color = this.randomColor();
      me.email = user.email;
      me.role = "";
      this.members.push(me);
    },
    randomColor() {
      const color = this.color[Math.floor(Math.random() * this.color.length)];
      color.concat(" darken-2");
      return color;
    },
    removeMember(i) {
      this.members.splice(i, 1);
    },
    async createTeam() {
      let localTeam = this.getLocalTeam();
      let teamInDb = null;
      for (let i = 0; i < this.members.length; i++) {
        if (
          this.members[i].role === "" ||
          this.members[i].role === null ||
          this.members[i].role === undefined
        ) {
          this.errors = "All members need roles";
          break;
        } else {
          this.errors = null;
        }
      }
      if (this.errors != null) {
        return;
      } else {
        for (let i = 0; i < this.members.length; i++) {
          for (let j = 0; j < this.roles.length; j++) {
            if (this.members[i].role === this.roles[j].role) {
              this.members[i].roleid = this.roles[j].id;
            }
          }
        }
        console.log(teamInDb);
        await feathersClient
          .service("teams")
          .on("created", team => (teamInDb = team));

        await feathersClient.service("teams").create({
          name: localTeam.name,
          description: localTeam.description
        });
        for (let i = 0; i < this.members.length; i++) {
          delete this.members[i].email;
          delete this.members[i].id;
          this.members[i].teamid = teamInDb.id;
          await feathersClient.service("members").create({
            teamid: this.members[i].teamid,
            userid: this.members[i].userid,
            roleid: this.members[i].roleid,
            fav: false
          });
        }
        this.$emit("teamCreated", true);
      }
    },
    async getUserId(memberEmail) {
      try {
        const raw = await feathersClient.service("users").find({
          query: {
            email: memberEmail,
            $select: ["id"]
          }
        });
        return raw.data[0].id;
      } catch (err) {
        this.errors = `${memberEmail} is not a user`;
      }
    },
    getLocalTeam() {
      return {
        name: this.teamname,
        description: this.description
      };
    },
    myMemberName(i) {
      if (i === 0) {
        return true;
      }
      return false;
    },
    step(n) {
      let nextStep = true;
      if (n === 2) {
        if (this.teamname === "" || this.teamname === null) {
          this.errors = "Please enter a team name to continue";
          nextStep = false;
        }
      } else if (n === 4) {
        if (this.description === "" || this.description === null) {
          this.errors = "Please describe your project";
          nextStep = false;
        }
      }

      if (nextStep) {
        this.errors = null;
        this.teamStepper = n;
      }
    }
  }
};
</script>
