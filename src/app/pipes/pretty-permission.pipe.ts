import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyPermission'
})
export class PrettyPermissionPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';

    let permissions: string[];

    // If array of objects -> extract the 'name' property
    if (Array.isArray(value) && typeof value[0] === 'object') {
      permissions = value.map(v => v.name);
    }
    // If array of strings
    else if (Array.isArray(value)) {
      permissions = value;
    }
    // If single string
    else if (typeof value === 'string') {
      permissions = value.split(',');
    }
    else {
      return value;
    }

    // Format each permission nicely
    return permissions
      .map(p => p
        .replace(/_/g, ' ')        // Convert underscores to spaces
        .toLowerCase()             // lowercase everything
        .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize each word
      )
      .join(', ');
  }
}
