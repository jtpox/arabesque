import Vue from 'vue';
import Router from 'vue-router';
import { store } from '@/components/store';

import Index from '@/components/index/Index';
import Info from '@/components/index/Info';

import About from '@/components/personal/About';
import Avatar from '@/components/personal/Avatar';
import Password from '@/components/personal/Password';

import Posts from '@/components/posts/List';
import NewPost from '@/components/posts/New';
import EditPost from '@/components/posts/Edit';

import Pages from '@/components/pages/List';
import NewPage from '@/components/pages/New';
import EditPage from '@/components/pages/Edit';

import Navigation from '@/components/navigation/List';

import UsersList from '@/components/users/List';

import TagsList from '@/components/tags/List';

import ImagesList from '@/components/images/List';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: { notLogged: true },
    },
    {
      path: '/info',
      name: 'Info',
      component: Info,
      meta: { isLogged: true },
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: { isLogged: true },
    },
    {
      path: '/avatar',
      name: 'Avatar',
      component: Avatar,
      meta: { isLogged: true },
    },
    {
      path: '/password',
      name: 'Password',
      component: Password,
      meta: { isLogged: true },
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts,
      meta: { isLogged: true },
    },
    {
      path: '/new/post',
      name: 'NewPost',
      component: NewPost,
      meta: { isLogged: true },
    },
    {
      path: '/edit/post/:id',
      name: 'EditPost',
      component: EditPost,
      meta: { isLogged: true },
    },
    {
      path: '/users',
      name: 'Users',
      component: UsersList,
      meta: { isLogged: true },
    },
    {
      path: '/tags',
      name: 'Tags',
      component: TagsList,
      meta: { isLogged: true },
    },
    {
      path: '/images',
      name: 'Images',
      component: ImagesList,
      meta: { isLogged: true },
    },
    {
      path: '/pages',
      name: 'Pages',
      component: Pages,
      meta: { isLogged: true },
    },
    {
      path: '/new/page',
      name: 'NewPage',
      component: NewPage,
      meta: { isLogged: true },
    },
    {
      path: '/edit/page/:id',
      name: 'EditPage',
      component: EditPage,
      meta: { isLogged: true },
    },
    {
      path: '/navigation',
      name: 'Navigation',
      component: Navigation,
      meta: { isLogged: true },
    },
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  // Clear selected image on every route load.
  store.commit('clearSelectedImage');

  if (to.meta.isLogged) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      next({ name: 'Index' });
    } else {
      next();
    }
  } else if (to.meta.notLogged) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      next();
    } else {
      next({ name: 'Posts' });
    }
  }
});
