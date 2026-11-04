const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const PLUGIN_FILE = path.join(__dirname, '..', 'wordpress-plugin', 'tvt-review-booster.php');
const README_FILE = path.join(__dirname, '..', 'wordpress-plugin', 'readme.txt');

describe('WordPress Plugin File Structure', () => {
  it('plugin PHP file exists', () => {
    assert.ok(fs.existsSync(PLUGIN_FILE), 'tvt-review-booster.php should exist');
  });

  it('readme.txt exists', () => {
    assert.ok(fs.existsSync(README_FILE), 'readme.txt should exist');
  });
});

describe('WordPress Plugin Headers', () => {
  let content;

  it('reads plugin file', () => {
    content = fs.readFileSync(PLUGIN_FILE, 'utf8');
    assert.ok(content.length > 0);
  });

  it('has Plugin Name header', () => {
    assert.ok(/Plugin Name:\s*TVT Review Booster/i.test(content));
  });

  it('has Version header', () => {
    assert.ok(/Version:\s*\d+\.\d+\.\d+/.test(content));
  });

  it('has Author header', () => {
    assert.ok(/Author:\s*TVT Agency/i.test(content));
  });

  it('has Requires PHP header', () => {
    assert.ok(/Requires PHP:\s*8\.1/.test(content));
  });

  it('has Text Domain header', () => {
    assert.ok(/Text Domain:\s*tvt-review-booster/.test(content));
  });
});

describe('WordPress Shortcode Registration', () => {
  let content;

  it('reads plugin file', () => {
    content = fs.readFileSync(PLUGIN_FILE, 'utf8');
    assert.ok(content.length > 0);
  });

  it('registers tvt_review_booster shortcode', () => {
    assert.ok(/add_shortcode\s*\(\s*['"]tvt_review_booster['"]/.test(content));
  });

  it('uses shortcode_atts with place_id attribute', () => {
    assert.ok(/shortcode_atts\s*\(/.test(content));
    assert.ok(content.includes('place_id'));
  });

  it('uses shortcode_atts with min_stars attribute', () => {
    assert.ok(content.includes('min_stars'));
  });

  it('generates iframe output', () => {
    assert.ok(content.includes('iframe'));
  });

  it('has admin settings page', () => {
    assert.ok(/add_options_page/.test(content));
  });

  it('registers settings', () => {
    assert.ok(/register_setting/.test(content));
  });

  it('prevents direct access', () => {
    assert.ok(content.includes("defined('ABSPATH')") || content.includes("defined( 'ABSPATH' )"));
  });
});
