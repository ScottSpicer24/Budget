import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard/budget',
        },
        {
          icon: 'assets/icons/heroicons/outline/eye.svg',
          label: 'Transactions',
          route: '/transactions',
        },
        {
          icon: 'assets/icons/heroicons/outline/eye.svg',
          label: 'Budgets',
          route: '/budgets',
        },
        {
          icon: 'assets/icons/heroicons/outline/eye.svg',
          label: 'Spending',
          route: '/spending',
        },
        {
          icon: 'assets/icons/heroicons/outline/eye.svg',
          label: 'Accounts',
          route: '/accounts',
        },
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
            { label: 'Two Steps', route: '/auth/two-steps' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Errors',
          route: '/errors',
          children: [
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        }
      ],
    }
  ];
}
