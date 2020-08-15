<template>
  <section class="main-section">
    <!--
			This row contains the loader.
			It is only rendered while client is awaiting data from server
			-->
    <LoadingData :loader="loader" />
    <v-dialog v-model="taskCard" class="mx-auto" max-width="420">
      <v-card>
        <div v-if="!editingExpanded && expandedTask.data">
          <v-img :src="placeholderSrc" height="200px"></v-img>

          <v-card-title>
            {{ expandedTask.title }}
          </v-card-title>

          <v-card-subtitle>
            {{ project.name }} - Sprint #{{ sprint.number }}
            <p v-if="expandedTask.data.backlogtitle != ''">
              Backlog Item: {{ expandedTask.data.backlogtitle }}
            </p>
            <p v-if="!expandedTask.data.backlogtitle != ''">No backlog item.</p>
          </v-card-subtitle>
          <hr />
          <v-card-text v-if="expandedTask.data.description != ''">
            {{ expandedTask.data.description }}
          </v-card-text>
          <v-card-text v-if="!expandedTask.data.description != ''">
            No description.
          </v-card-text>

          <v-card-actions v-if="owner">
            <v-btn text @click="editExpandedTask()">Edit</v-btn>
          </v-card-actions>

          <v-divider></v-divider>

          <v-card-text v-if="expandedTask.comments">
            <v-card-title>Comments </v-card-title>
            <v-list :three-line="true">
              <v-list-item
                v-for="(comment, i) in expandedTask.comments"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-subtitle>{{
                    comment.text
                  }}</v-list-item-subtitle>
                  <v-list-item-subtitle
                    >by {{ comment.username }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-text v-if="!expandedTask.comments">
            No comments.
          </v-card-text>
          <v-card-actions style="display:flex;flex-direction:column;">
            <v-textarea
              v-model="comment"
              style="width:100%"
              label="Write comment"
            ></v-textarea>
            <v-btn block @click="addComment()">Submit</v-btn>
          </v-card-actions>
        </div>
        <div v-if="editingExpanded">
          <v-img :src="placeholderSrc" height="200px">
            <CloudinaryUploader
              cloudName="karo"
              uploadPreset="karo_unsigned"
              :sources="['local', 'url']"
              :showAdvancedOptions="false"
              :cropping="true"
              :multiple="false"
              defaultSource="local"
              @completed="uploaded"
          /></v-img>

          <v-card-title>
            <v-text-field
              placeholder="Task Title"
              v-model="expandedTask.title"
            ></v-text-field>
          </v-card-title>

          <v-card-text>
            <v-textarea
              placeholder="Task Description"
              v-model="expandedTask.data.description"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="editedTask()">Done</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      color="red"
      direction="top"
      transition="scale-transition"
      v-if="!loader.pendingData"
      class="dial"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab">clear</v-icon>
          <v-icon v-else>more_horiz</v-icon>
        </v-btn>
      </template>
      <div class="dial-list">
        <v-btn dark small color="indigo" @click="closeSprint()">
          <v-icon left>check</v-icon>
          Complete Sprint
        </v-btn>
      </div>
    </v-speed-dial>
    <v-row v-if="!loader.pendingData">
      <v-col cols="12" md="8">
        <v-card class="tasks"
          ><v-toolbar>
            <v-icon left>list</v-icon>
            <v-toolbar-title>Task List</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="addingTasks = !addingTasks">
              <v-icon v-if="!addingTasks">add</v-icon>
              <v-icon v-if="addingTasks">clear</v-icon>
            </v-btn>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title
                    ><v-switch
                      v-model="sort"
                      label="Move done items to the end?"
                      color="primary"
                  /></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-progress-linear
              :active="tasksLoading"
              :indeterminate="tasksLoading"
              absolute
              bottom
              color="blue accent-4"
            ></v-progress-linear>
          </v-toolbar>
          <v-toolbar dense flat class="red darken-4" v-if="taskErrors">
            <v-icon left>warning</v-icon>
            {{ taskErrors }}
          </v-toolbar>
          <v-expand-transition>
            <v-row class="px-3" v-if="addingTasks">
              <v-col
                cols="12"
                :class="
                  ` ${
                    dark ? 'grey darken-4' : 'blue lighten-5'
                  } flex-row-center my-0`
                "
              >
                <v-text-field
                  v-model="newItem"
                  label="Add to the todo list"
                  style="width:60%!important;"
                  class="mr-2"
                  @keydown.enter="addItem"
                />
                <v-select
                  v-model="backlogItemName"
                  :items="backlogNames"
                  label="Backlog Item"
                ></v-select>
                <v-btn @click="addItem" outlined>
                  Add
                </v-btn>
              </v-col>
            </v-row>
          </v-expand-transition>

          <div
            v-if="!tasks.length"
            align="center"
            justify="center"
            class="py-3"
          >
            <em>No tasks</em>
          </div>

          <main v-if="tasks.length">
            <v-list class="px-1">
              <v-list-item
                v-for="task in sortedTasks"
                :key="task.id"
                :class="`ma-2 ${dark ? 'grey darken-2' : 'grey lighten-4'}`"
              >
                <v-btn
                  icon
                  @click="deleteItemFromList(task.id)"
                  aria-label="Delete"
                  title="Delete"
                  class="mr-2"
                  color="red"
                  x-small
                >
                  <v-icon>clear</v-icon>
                </v-btn>
                <v-list-item-title
                  :class="`label ${task.done ? 'done' : ''}`"
                  >{{ task.title }}</v-list-item-title
                >
                <v-btn
                  icon
                  aria-label="View"
                  class="mx-2"
                  title="View"
                  small
                  @click="expandTask(task.id)"
                >
                  <v-icon>remove_red_eye</v-icon>
                </v-btn>
                <v-btn
                  @click="markDone(task)"
                  :aria-label="task.done ? 'Undo' : 'Done'"
                  :title="task.done ? 'Undo' : 'Done'"
                  icon
                  class="pr-1"
                >
                  <v-icon>{{
                    task.done ? "check_box" : "check_box_outline_blank"
                  }}</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </main>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" justify="center" class="sidebar">
        <v-card class="mb-1">
          <v-toolbar>
            <v-icon left>timeline</v-icon>
            <v-toolbar-title>Reports</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showReports = !showReports">
              <v-icon v-if="showReports">keyboard_arrow_up</v-icon>
              <v-icon v-else>keyboard_arrow_down</v-icon>
            </v-btn>
          </v-toolbar>
          <TaskPieChart :tasks="tasks" v-if="showReports" />

          <!-- <BurnDownChart :value="value" v-if="showReports" /> -->
        </v-card>
        <!-- <v-card class="mt-3">
          <v-toolbar>
            <v-icon left>history</v-icon>
            <v-toolbar-title> Activity</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn icon @click="showActivity = !showActivity">
              <v-icon v-if="showActivity">keyboard_arrow_up</v-icon>
              <v-icon v-else>keyboard_arrow_down</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card tile :elevation="0" v-if="showActivity">
            <v-card-subtitle>
              All my activity
            </v-card-subtitle>
          </v-card>
        </v-card> -->
      </v-col>
    </v-row>
  </section>
</template>

<style lang="scss" scoped>
.flex-row-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.label {
  transition: all 0.2s ease-in-out;
}
.done {
  opacity: 0.5;
  text-decoration: line-through;
  font-style: italic;
}

.dial-list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 0.5rem;
}

.main-section {
  min-height: 85vh !important;
}

.tasks {
  min-height: 0;
}

@media only screen and (min-width: 960px) {
  .tasks {
    min-height: 80vh;
  }
  .sidebar {
    position: fixed;
    right: 0;
  }
}
</style>

<script>
/* eslint-disable no-console*/
import store from "@/store/index";
import router from "@/router/index";
import feathersClient from "@/feathers-client";
import LoadingData from "@/components/loaders/LoadingData";
import TaskPieChart from "@/components/charts/TaskPieChart";
// import BurnDownChart from "@/components/charts/BurnDownChart";
import CloudinaryUploader from "@/components/uploaders/CloudinaryUploader";
export default {
  name: "Sprint",
  data: () => ({
    backlogItemName: "",
    addingTasks: false,
    newItem: "",
    sort: false,
    tasks: [],
    sprint: {},
    value: [100, 0, 70, 42, 37, 0, 18, 16, 2, 10, 0, 6, 5, 3, 2, 0],
    fab: false,
    tabs: null,
    taskErrors: null,
    tasksLoading: false,
    loader: {
      pendingData: true,
      pendingMsg: "Getting Sprint Data...",
      failed: false
    }, // Loader object
    taskCard: false,
    expandedTask: [],
    showReports: false,
    showActivity: false,
    project: {},
    editingExpanded: false,
    sprintBacklog: [],
    backlogNames: [],
    owner: false,
    comment: ""
  }),
  components: {
    LoadingData,
    TaskPieChart,
    // BurnDownChart,
    CloudinaryUploader
  },
  computed: {
    placeholderSrc() {
      if (
        this.expandedTask.data.background === null ||
        this.expandedTask.data.background === undefined ||
        this.expandedTask.data.background === ""
      ) {
        return require("@/assets/img-placeholder.jpg");
      } else {
        return this.expandedTask.data.background;
      }
    },
    getID() {
      return this.$router.history.current.params.id;
    },
    sortedTasks() {
      if (!this.sort) {
        return this.tasks;
      }
      let done = this.tasks.filter(item => {
        return item.done;
      });
      let notDone = this.tasks.filter(item => {
        return !item.done;
      });

      return [...notDone, ...done];
    },
    dark() {
      const theme = store.getters.currentTheme;
      if (theme === "dark") {
        return true;
      }
      return false;
    }
  },
  async created() {
    store.commit("setPageTitle", "Karo");
    await this.fetchData();
  },
  methods: {
    async closeSprint() {
      let sprint = this.sprint;
      sprint.status = 2;
      sprint.backlog = JSON.stringify(this.sprint.backlog);
      await feathersClient
        .service("sprints")
        .patch(this.sprint.id, sprint)
        .then(router.push("/project/" + this.project.id));
    },
    async addComment() {
      let comment = {};
      comment.text = this.comment;
      let user = store.getters.getUserData;
      let rawCommentUser = await feathersClient.service("users").find({
        query: {
          id: user.id
        }
      });
      comment.userid = rawCommentUser.data[0].id;
      comment.username =
        rawCommentUser.data[0].firstname + rawCommentUser.data[0].lastname;
      this.expandedTask.comments.push(comment);
      this.expandedTask.data = JSON.stringify(this.expandedTask.data);
      this.expandedTask.comments = JSON.stringify(this.expandedTask.comments);
      await feathersClient
        .service("tasks")
        .patch(this.expandedTask.id, this.expandedTask)
        .then(async val => {
          this.expandedTask = val;
          this.expandedTask.data = JSON.parse(this.expandedTask.data);
          this.expandedTask.comments = JSON.parse(this.expandedTask.comments);
          this.taskCard = false;
          this.taskCard = true;
        });
    },
    uploaded(val) {
      this.expandedTask.data.background = val.url;
    },
    async editedTask() {
      this.expandedTask.data = JSON.stringify(this.expandedTask.data);
      this.expandedTask.comments = JSON.stringify(this.expandedTask.comments);
      await feathersClient
        .service("tasks")
        .patch(this.expandedTask.id, this.expandedTask)
        .then(async () => {
          this.tasks = await this.getTasks();
          for (let i = 0; i < this.tasks.length; i++) {
            if (this.expandedTask.id === this.tasks[i].id) {
              this.expandedTask = this.tasks[i];
              break;
            }
          }
          this.editingExpanded = false;
          this.taskCard = false;
          this.taskCard = true;
        });
    },
    editExpandedTask() {
      this.editingExpanded = true;
      if (this.expandedTask.data === null) {
        this.expandedTask.data = {};
        this.expandedTask.data.description = "";
        this.expandedTask.data.background = "";
        this.expandedTask.data.backlogid = "";
        this.expandedTask.data.backlogtitle = "";
        this.expandedTask.data.owner = "";
        this.expandedTask.data.activity = [];
        this.expandedTask.comments = [];
      }
    },
    // Returns info of project
    async getProject(val) {
      let rawProject = await feathersClient.service("projects").find({
        query: { id: val }
      });
      return rawProject.data[0];
    },
    async addItem() {
      if (
        this.newItem === "" ||
        this.newItem === undefined ||
        this.newItem === null
      ) {
        this.taskErrors = "Enter a task to add";
      } else {
        this.tasksLoading = true;
        this.taskErrors = null;
        let task = {};
        task.title = this.newItem;
        task.sprintid = this.sprint.id;
        task.done = false;
        task.data = {};
        task.data.description = "";
        task.data.background = "";
        task.data.activity = [];
        let user = store.getters.getUserData;
        task.data.owner = user.id;
        for (let i = 0; i < this.sprintBacklog.length; i++) {
          console.log(this.sprintBacklog, this.backlogItemName);
          if (this.sprintBacklog[i].title === this.backlogItemName) {
            task.data.backlogid = this.sprintBacklog[i].id;
            task.data.backlogtitle = this.sprintBacklog[i].title;
            break;
          } else {
            task.data.backlogtitle = "";
            task.data.backlogid = "";
          }
        }
        task.data = JSON.stringify(task.data);
        task.comments = JSON.stringify(task.comments);
        await feathersClient
          .service("tasks")
          .create(task)
          .then(async () => (this.tasks = await this.getTasks()));
        this.tasksLoading = false;
        this.newItem = "";
      }
    },
    async markDone(task) {
      task.done = !task.done;
      await feathersClient.service("tasks").patch(task.id, {
        done: task.done
      });
    },
    async deleteItemFromList(id) {
      this.tasksLoading = true;
      await feathersClient
        .service("tasks")
        .remove(id)
        .then(async () => (this.tasks = await this.getTasks()));
      this.tasksLoading = false;
    },
    async getSprint() {
      const raw = await feathersClient.service("sprints").find({
        query: {
          id: this.$router.history.current.params.id
        }
      });
      const sprint = { ...raw.data[0] };
      sprint.backlog = JSON.parse(sprint.backlog);
      return sprint;
    },
    async getTasks() {
      const raw = await feathersClient.service("tasks").find({
        query: {
          sprintid: this.sprint.id,
          $sort: {
            createdAt: -1
          }
        }
      });
      for (let i = 0; i < raw.data.length; i++) {
        raw.data[i].data = JSON.parse(raw.data[i].data);
        raw.data[i].comments = JSON.parse(raw.data[i].comments);
      }
      return [...raw.data];
    },
    async fetchData() {
      this.sprint = await this.getSprint();
      this.tasksLoading = true;
      this.loader.pendingData = false;
      this.tasks = await this.getTasks();
      this.project = await this.getProject(this.sprint.projectid);
      const arr = Object.values(this.sprint.backlog);
      for (let i = 0; i < arr.length; i++) {
        const raw = await feathersClient.service("backlog-items").find({
          query: {
            id: arr[i]
          }
        });
        this.sprintBacklog[i] = raw.data[0];
        this.backlogNames[i] = raw.data[0].title;
      }
      console.log(this.sprintBacklog, this.backlogNames);

      this.tasksLoading = false;
    },
    expandTask(id) {
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id === id) {
          this.expandedTask = this.tasks[i];

          let user = store.getters.getUserData;
          if (user.id === this.expandedTask.data.owner) {
            this.owner = user;
          } else {
            this.owner = false;
          }
          if (this.expandedTask.comments == null) {
            this.expandedTask.comments = [];
          }
          this.taskCard = true;
        }
      }
    }
  }
};
</script>
