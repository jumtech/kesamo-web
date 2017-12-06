import RoutineDetailView from './components/RoutineDetailView.vue';
import RoutineListView from './components/RoutineLIstView.vue';

export default [
  { path: '/', redirect: '/routine' },
  { path: '/routine', component: RoutineDetailView },
  { path: '/routines', component: RoutineListView },
  { path: '*', redirect: '/' },
];