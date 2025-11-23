import { PrettyPermissionPipe } from './pretty-permission.pipe';

describe('PrettyPermissionPipe', () => {
  it('create an instance', () => {
    const pipe = new PrettyPermissionPipe();
    expect(pipe).toBeTruthy();
  });
});
